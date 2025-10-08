﻿using HolidayLocation_API.Data;
using HolidayLocation_API.Models;
using HolidayLocation_API.Repositories.IRepository;
using Microsoft.EntityFrameworkCore;

namespace HolidayLocation_API.Repositories.Repository
{
    public class PropertyRepository : Repository<Property>, IPropertyRepository
    {
        private readonly AppDbContext _db;
        public PropertyRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _db = appDbContext;
        }

        public async Task<Property> UpdatePropertyAsync(Property property)
        {
            _db.Property.Update(property);
            await _db.SaveChangesAsync();
            return property;
        }

        public async Task<bool> PropertyExistsAsync(int id)
        {
            return await _db.Property.AsNoTracking().AnyAsync(p => p.Id == id);
        }

        public async Task<int> GetNextAvailableIdAsync()
        {
            var existingIds = await _db.Property
                .Select(p => p.Id)
                .OrderBy(id => id)
                .ToListAsync();

            if(!existingIds.Any())
            {
                return 1; // Start IDs from 1 if no properties exist
            }

            int nextId = 1;
            foreach (var id in existingIds)
            {
                if (id != nextId)
                {
                    return nextId;
                }
                nextId++;
            }

            return existingIds.Max() + 1; // Return the next ID after the highest existing ID
        }
    }
}
