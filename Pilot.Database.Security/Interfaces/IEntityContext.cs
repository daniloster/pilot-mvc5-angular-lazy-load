﻿using Pilot.Entity.Security;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Security.Interfaces
{
    public interface IEntityContext<TEntity> where TEntity : class, IBaseEntity
    {
        IBaseDbContext DbContext { get; }

        DbSet<TEntity> Repository { get; }

        T GetAttachedEntity<T>(T entity) where T : class, IBaseEntity;

        T GetAttachedEntity<T>(T entity, string[] collectionToLoad) where T : class, IBaseEntity;

        void Save(TEntity entity);

        void Delete(long id);

        void Delete(TEntity entity);

        TEntity Get(long id);

        IList<TEntity> Get(long[] ids);

        IList<TEntity> Get();

        IQueryable<TEntity> AsQueryableTyped();

        IQueryable AsQueryable();

        void Dispose();
    }
}