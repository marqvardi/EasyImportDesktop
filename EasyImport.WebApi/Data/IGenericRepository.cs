using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Data
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
    }
}
