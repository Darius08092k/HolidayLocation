using HolidayLocation_API.DTO;
using HolidayLocation_API.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Signing;


namespace HolidayLocation_API.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = registerRequest.Email,
                Email = registerRequest.Email
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new { message = "Registered and signed in successfully" });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if(user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var valid = await _signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, false);
            if (!valid.Succeeded) return Unauthorized("Invalid credentials");

            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { message = "Signed in" });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Signed out" });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var user = await _userManager.GetUserAsync(User);
            if(user == null)
            {
                return Unauthorized();
            }
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new 
            { 
                user.Email,
                user.UserName,
                user.PhoneNumber,
                Roles = roles
            });
        }


        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userList = new List<object>();
            foreach(var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new 
                { 
                    user.Id,
                    user.Email,
                    user.UserName,
                    user.PhoneNumber,
                    Roles = roles
                });
            }
            return Ok(userList);
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if(user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            
            if(!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok(new { message = "User deleted successfully" });
        }
        [HttpPut("EditUser/{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] UpdateUserRequest updateUserRequest)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Update Email
            if (!string.IsNullOrWhiteSpace(updateUserRequest.Email) && !string.Equals(updateUserRequest.Email, user.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existing = await _userManager.FindByEmailAsync(updateUserRequest.Email);
                if (existing != null && existing.Id != user.Id)
                {
                    return BadRequest(new { message = "Email is already in use." });
                }

                var emailRes = await _userManager.SetEmailAsync(user, updateUserRequest.Email);
                if (!emailRes.Succeeded) return BadRequest(emailRes.Errors);
            }

            // Update Username
            if (!string.IsNullOrWhiteSpace(updateUserRequest.UserName) && !string.Equals(updateUserRequest.UserName, user.UserName, StringComparison.Ordinal))
            {
                var nameRes = await _userManager.SetUserNameAsync(user, updateUserRequest.UserName);
                if (!nameRes.Succeeded) return BadRequest(nameRes.Errors);
            }

            // Update phone number
            if (!string.IsNullOrWhiteSpace(updateUserRequest.PhoneNumber))
            {
                user.PhoneNumber = updateUserRequest.PhoneNumber;
            }

            // Update roles if provided
            if (updateUserRequest.Roles != null)
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeRolesResult.Succeeded)
                {
                    return BadRequest(removeRolesResult.Errors);
                }

                var addRolesResult = await _userManager.AddToRolesAsync(user, updateUserRequest.Roles);
                if (!addRolesResult.Succeeded)
                {
                    return BadRequest(addRolesResult.Errors);
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "User updated successfully" });
        }

        [HttpPost("CreateUser")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterRequest registerRequest, string role)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate role
            var targetRole = string.IsNullOrWhiteSpace(role) ? "User" : role.Trim();
            if (targetRole != "User" && targetRole != "Admin")
            {
                return BadRequest(new { message = "Role must be 'User' or 'Admin'." });
            }

            // Verify duplicate email
            var existing = await _userManager.FindByEmailAsync(registerRequest.Email);
            if (existing != null)
            {
                return Conflict(new { message = "Email is already in use." });
            }

            var user = new ApplicationUser
            {
                UserName = registerRequest.Email,
                Email = registerRequest.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, targetRole);
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            return Ok(new { message = "User created successfully" });
        }
    }
}
