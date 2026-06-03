/**
 * EntityPage.jsx — generic module page (port of renderEntityPage + CRUD)
 * =====================================================================
 * Drives every entity route (/projects, /students, …). Fetches the list,
 * supports debounced search, and wires the add/edit/delete flow through the
 * shared FormModal, ConfirmDialog and Toast systems.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { API } from '../api/api.js';
import { ENTITIES, singularize } from '../config/entities.jsx';
import { Topbar } from '../components/Topbar.jsx';
import { DataTable, EmptyState } from '../components/DataTable.jsx';
import { FormModal } from '../components/FormModal.jsx';
import { Icon } from '../config/icons.jsx';
import { useToast } from '../components/Toast.jsx';
import { useConfirm } from '../components/ConfirmDialog.jsx';

export function EntityPage() {
  const { entityKey } = useParams();
  const cfg = ENTITIES[entityKey];

  const toast = useToast();
  const confirm = useConfirm();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(''); // the query reflected in `rows`
  const [modal, setModal] = useState(null); // { mode:'add'|'edit', title, initialValues, id }
  const debounceRef = useRef(null);

  // Fetch list for a given query.
  const load = useCallback(
    async (q = '') => {
      if (!cfg) return;
      setLoading(true);
      try {
        const data = await API.list(cfg.entity, q ? { q } : {});
        setRows(data);
        setActiveQuery(q);
      } catch (err) {
        toast(err.message || 'Failed to load', 'danger');
      } finally {
        setLoading(false);
      }
    },
    [cfg, toast]
  );

  // Reload when the route entity changes; reset search.
  useEffect(() => {
    setQuery('');
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityKey]);

  // Debounced search.
  const onSearch = (v) => {
    setQuery(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(v.trim()), 280);
  };

  if (!cfg) return <Navigate to="/" replace />;

  const singular = singularize(cfg.title);

  // ---- CRUD handlers ----
  const openAdd = () => setModal({ mode: 'add', title: `Add ${singular}`, initialValues: {} });

  const openEdit = async (id) => {
    try {
      const current = await API.get(cfg.entity, id);
      setModal({ mode: 'edit', title: `Edit ${singular} #${id}`, initialValues: current, id });
    } catch (err) {
      toast(err.message || 'Could not load record', 'danger');
    }
  };

  const submit = async (values) => {
    try {
      if (modal.mode === 'add') {
        await API.create(cfg.entity, values);
        toast(`${singular} created`, 'success');
      } else {
        await API.update(cfg.entity, modal.id, values);
        toast(`${singular} updated`, 'success');
      }
      setModal(null);
      load(activeQuery);
    } catch (err) {
      toast(err.message || 'Save failed', 'danger');
    }
  };

  const remove = async (id) => {
    const ok = await confirm(
      `Delete this ${singular.toLowerCase()} (#${id})? This action cannot be undone.`,
      'Delete'
    );
    if (!ok) return;
    try {
      await API.remove(cfg.entity, id);
      toast(`${singular} deleted`, 'success');
      load(activeQuery);
    } catch (err) {
      toast(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <>
      <Topbar
        breadcrumb={cfg.section || 'CRM'}
        title={cfg.title}
        showSearch
        searchValue={query}
        onSearch={onSearch}
        primaryLabel={`+ Add ${singular}`}
        onPrimary={openAdd}
      />

      <section className="content">
        {loading ? (
          <div className="loader">
            <div className="spinner" />
            <div>Loading…</div>
          </div>
        ) : (
          <div className="card table-card">
            <div className="table-toolbar">
              <div className="table-meta">
                <span className="badge badge-info">
                  {rows.length} record{rows.length === 1 ? '' : 's'}
                </span>
                {activeQuery && <span className="muted">filtered by “{activeQuery}”</span>}
              </div>
              <div className="table-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => load(activeQuery)}>
                  <Icon name="refresh" /> Refresh
                </button>
              </div>
            </div>
            <div className="table-wrap">
              {rows.length ? (
                <DataTable cfg={cfg} rows={rows} onEdit={openEdit} onDelete={remove} />
              ) : (
                <EmptyState
                  title={`No ${cfg.title.toLowerCase()} yet`}
                  message='Click the “+ Add” button in the top right to create one.'
                />
              )}
            </div>
          </div>
        )}
      </section>

      {modal && (
        <FormModal
          title={modal.title}
          fields={cfg.fields}
          initialValues={modal.initialValues}
          onSubmit={submit}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
