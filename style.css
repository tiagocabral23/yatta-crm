/* --- ESTILO VISUAL --- */
* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; display: flex; height: 100vh; overflow: hidden; }

/* MENU LATERAL */
#sidebar { width: 260px; background-color: #111827; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; transition: transform 0.3s ease; z-index: 1000; }
.brand { padding: 25px; text-align: center; background: #000; border-bottom: 2px solid #fbbf24; display: flex; justify-content: space-between; align-items: center; }
.brand h1 { color: #fbbf24; font-size: 20px; font-weight: 900; font-style: italic; letter-spacing: 1px; margin: 0 auto; }
.nav-menu { flex: 1; padding: 20px 0; overflow-y: auto; }
.nav-item { width: 100%; padding: 15px 25px; background: transparent; border: none; color: #9ca3af; text-align: left; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; text-transform: uppercase; transition: 0.2s; }
.nav-item:hover { background-color: #1f2937; color: #fff; }
.nav-item.active { background-color: #fbbf24; color: #000; border-right: 4px solid #b45309; }
.sidebar-footer { padding: 20px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #1f2937; background: #0f172a; }

/* BOTÃO MOBILE */
.btn-close-sidebar { display: none; background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; }
.btn-hamburger { display: none; background: none; border: none; font-size: 24px; cursor: pointer; color: #1f2937; margin-right: 15px; }

/* ÁREA PRINCIPAL */
#main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; width: 100%; }
header { height: 60px; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.header-left { display: flex; align-items: center; }
.viewport { flex: 1; padding: 20px; overflow-y: auto; background: #f3f4f6; }
.tab-content { display: none; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* CARDS DO DASHBOARD E RELATÓRIO */
.grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
.card-stat { background: #fff; padding: 15px 20px; border-radius: 10px; border: 1px solid #e5e7eb; border-top: 4px solid #fbbf24; }
.card-stat label { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-bottom: 5px; }
.card-stat .value { font-size: 20px; font-weight: 900; color: #111827; }

/* CARDS DE INVENTÁRIO */
.inventory-panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px; }
.inv-card { background: #fff; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; position: relative; overflow: hidden;}
.inv-card.critical { border-color: #ef4444; background: #fff5f5; }
.inv-card.blocked { border-color: #f59e0b; background: #fffbeb; } 
.inv-label { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-bottom: 5px; }
.inv-value { font-size: 18px; font-weight: 900; color: #111827; }
.inv-card.critical .inv-value { color: #991b1b; }
.inv-card.blocked .inv-value { color: #b45309; }

/* TABELAS */
.data-card { background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px; }
.data-card-header { background: #1f2937; color: #fbbf24; padding: 10px 15px; font-weight: 800; text-transform: uppercase; font-size: 11px; }
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th { padding: 10px 15px; font-size: 10px; text-transform: uppercase; background: #f9fafb; color: #4b5563; text-align: left; border-bottom: 1px solid #e5e7eb; }
td { padding: 10px 15px; font-size: 12px; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: middle; }

/* RANKING */
.ranking-row { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #f3f4f6; align-items: center; }
.ranking-pos { font-weight: 900; font-size: 14px; color: #fbbf24; background: #1f2937; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
.ranking-name { font-weight: 700; font-size: 12px; }
.ranking-val { font-weight: 800; font-size: 12px; color: #059669; }

/* KANBAN */
.kanban-board { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; height: calc(100vh - 200px); align-items: flex-start; }
.kanban-col { background: #e5e7eb; min-width: 280px; max-width: 280px; border-radius: 8px; display: flex; flex-direction: column; max-height: 100%; transition: background 0.3s; border: 2px solid transparent; }
.kanban-col.drag-over { background: #d1d5db; border-color: #9ca3af; border-style: dashed; }
.kanban-header { padding: 10px 15px; font-weight: 800; text-transform: uppercase; font-size: 11px; border-radius: 8px 8px 0 0; display: flex; flex-direction: column; gap: 2px; color: #fff; }
.kanban-header-total { font-size: 10px; opacity: 0.9; font-weight: 600; }
.kanban-list { padding: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; min-height: 100px; }

.card { background: #fff; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #111827; cursor: grab; font-size: 12px; transition: transform 0.2s; position: relative; }
.card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.15); border-left-color: #fbbf24; } 
.card:active { cursor: grabbing; }
.card.dragging { opacity: 0.5; transform: rotate(2deg); }
.card-tags { display: flex; gap: 5px; margin-bottom: 5px; justify-content: space-between; align-items: center;}
.tag { padding: 2px 5px; background: #f3f4f6; border-radius: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.card-action { margin-top: 8px; font-size: 10px; background: #eff6ff; color: #1e40af; padding: 4px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }

/* BOTÕES NO CARD */
.card-btn-group { display: flex; gap: 3px; }
.btn-card-icon { background: transparent; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; padding: 2px 6px; font-size: 10px; color: #6b7280; transition:0.2s; }
.btn-card-icon:hover { background: #fbbf24; border-color: #d97706; color: #000; }
.btn-card-delete:hover { background: #fee2e2; border-color: #ef4444; color: #b91c1c; }

/* RELATÓRIOS */
.filter-bar { display: flex; gap: 10px; margin-bottom: 20px; background: #fff; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb; align-items: flex-end; flex-wrap: wrap; }
.filter-group { flex: 1; min-width: 150px; }
.filter-group label { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; color: #4b5563; }
.filter-group input, .filter-group select { width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; }

/* HISTÓRICO (TIMELINE) */
.timeline-item { padding: 10px 0 10px 20px; border-left: 2px solid #e5e7eb; position: relative; }
.timeline-item::before { content: ''; position: absolute; left: -6px; top: 15px; width: 10px; height: 10px; border-radius: 50%; background: #fbbf24; border: 2px solid #fff; }
.timeline-date { font-size: 10px; color: #6b7280; font-weight: 700; }
.timeline-action { font-size: 12px; font-weight: 800; color: #111827; }
.timeline-detail { font-size: 11px; color: #374151; margin-top: 2px; }
.timeline-user { font-size: 9px; color: #9ca3af; font-style: italic; margin-top: 2px; }

/* BOTOES E MODAIS */
.btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 700; font-size: 11px; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px; }
.btn-main { background: #fbbf24; color: #000; }
.btn-dark { background: #1f2937; color: #fbbf24; }
.btn-small { padding: 4px 8px; font-size: 10px; }
.btn-danger { background: #fee2e2; color: #991b1b; }
.btn-whatsapp { background: #25D366; color: #fff; border: 1px solid #20bd5a; font-size: 10px; padding: 4px 8px; text-decoration: none; border-radius: 4px; }
.btn-whatsapp:hover { background: #128c7e; }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.modal.active { display: flex; }
.modal-box { background: #fff; width: 100%; max-width: 450px; padding: 25px; border-radius: 12px; max-height: 90vh; overflow-y: auto; }
.form-item { margin-bottom: 12px; }
.form-item label { display: block; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; color: #4b5563; }
.form-item input, .form-item select, .form-item textarea { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; background: #fff; font-family: inherit; }

#toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #111827; color: #fbbf24; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 12px; opacity: 0; transition: 0.3s; pointer-events: none; z-index: 3000; }
#user-overlay { position: fixed; inset: 0; background: #000; z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.user-select-card { background: #1f2937; color: #fff; padding: 20px; border-radius: 10px; cursor: pointer; text-align: center; width: 150px; border: 2px solid transparent; }
.user-select-card:hover { border-color: #fbbf24; transform: translateY(-2px); }

.grid-2-col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }

/* HELPER */
.gestor-only { display: none !important; }
.show-gestor { display: inline-flex !important; }
.badge { padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.badge-success { background: #d1fae5; color: #065f46; }
.badge-warning { background: #fef3c7; color: #b45309; }
.badge-danger { background: #fee2e2; color: #991b1b; }

/* AGENDA STYLES */
.agenda-group { margin-bottom: 20px; }
.agenda-group h4 { font-size: 11px; text-transform: uppercase; margin-bottom: 10px; color: #6b7280; font-weight: 800; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
.agenda-item { background: #fff; border: 1px solid #e5e7eb; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.agenda-item.delayed { border-left: 4px solid #ef4444; }
.agenda-item.today { border-left: 4px solid #f59e0b; }
.agenda-item.future { border-left: 4px solid #10b981; }
.agenda-info { flex: 1; }
.agenda-client { font-weight: 800; font-size: 13px; color: #1f2937; }
.agenda-desc { font-size: 12px; color: #4b5563; margin-top: 2px; }
.agenda-date { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-right: 15px; }

/* MOBILE RESPONSIVE */
@media (max-width: 900px) { 
    .grid-2-col { grid-template-columns: 1fr; } 
}

@media (max-width: 768px) {
    #sidebar { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%); width: 260px; box-shadow: 2px 0 10px rgba(0,0,0,0.5); }
    #sidebar.open { transform: translateX(0); }
    .btn-close-sidebar { display: block; }
    .btn-hamburger { display: block; }
    .kanban-board { height: auto; min-height: 500px; }
}

/* ESTILOS DE IMPRESSÃO */
@media print {
    #sidebar, header, .filter-bar button, .modal, #toast, .nav-menu { display: none !important; }
    #main-content { margin: 0; padding: 0; height: auto; overflow: visible; }
    .viewport { overflow: visible; padding: 0; background: #fff; }
    .tab-content { display: none; }
    #tab-relatorios { display: block !important; }
    body { background: #fff; color: #000; height: auto; overflow: visible; }
    .data-card { border: 1px solid #000; box-shadow: none; margin-bottom: 20px; }
    .data-card-header { background: #ddd; color: #000; font-weight: bold; border-bottom: 1px solid #000; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; color: #000; padding: 8px; font-size: 10px; }
    th { background: #eee; }
    .grid-stats .card-stat { border: 1px solid #000; break-inside: avoid; }
    .card-stat .value { color: #000 !important; }
    .badge { border: 1px solid #000; background: none !important; color: #000 !important; }
}