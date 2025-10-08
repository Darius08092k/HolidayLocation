namespace HolidayLocation_API.Repositories.IRepository
{
    public interface IRepository<T> where T : class
    {
        Task CreateAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task DeleteAsync(int id);
        Task DeleteAllAsync();
        Task SaveAsync();
    }
}
