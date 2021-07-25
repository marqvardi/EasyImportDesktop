using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyImport.WebApi.Data
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;

        Task<int> Complete();
    }
}
