using HolidayLocation_API.Data;
using HolidayLocation_API.Repositories.IRepository;
using Microsoft.EntityFrameworkCore;

namespace HolidayLocation_API.Repositories.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        internal DbSet<T> dbSet;
        public Repository(AppDbContext appDbContext)
        {
            _context = appDbContext;
            dbSet = _context.Set<T>();
        }
        public async Task CreateAsync(T entity)
        {
            await _context.AddAsync(entity);
            await SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var property = await _context.Set<T>().FindAsync(id);

            if(property == null)
            {
                throw new ArgumentException("Entity not found in the database.");
            }
            else
            {
                _context.Set<T>().Remove(property);
                await SaveAsync();
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
