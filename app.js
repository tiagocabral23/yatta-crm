/**
 * YATTA CRM - v3.9.15
 * Refatorado para Modularização e futura integração com Supabase.
 */

const STORAGE_KEY = "YATTA_CRM_V3_9_15_FINAL";

// Configuração do Ambiente (Futuramente, trocaremos para 'supabase')
const CONFIG = {
    mode: 'local', // 'local' ou 'supabase'
    version: '3.9.15'
};

const APP = {
    // Estado da Aplicação
    data: { stock: [], users: [], deals: [], clients: [] },
    user: null,
    dragId: null,

    /**
     * INICIALIZAÇÃO
     */
    init: () => {
        // [TODO: SUPABASE] No futuro, substituir por await supabase.from(...).select()
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) APP.data = JSON.parse(raw);
        
        // Dados Padrão (Seed)
        if (APP.data.users.length === 0) APP.data.users.push({name: 'Gestor Inicial', role: 'gestor'});
        if (!Array.isArray(APP.data.stock)) APP.data.stock = [];
        if (!Array.isArray(APP.data.clients)) APP.data.clients = [];

        // BACKFILL: Correções de dados antigos
        APP.data.deals.forEach(d => {
            if(d.stage === 'ganho') {
                if (d.stockId) {
                    const s = APP.data.stock.find(x => x.id === d.stockId);
                    if(s) {
                        if(s.status !== 'Vendido') s.status = 'Vendido';
                        if(d.originalCost === undefined || (d.originalCost === 0 && s.cost > 0)) {
                            d.originalCost = s.cost;
                        }
                    }
                } else {
                    if(d.originalCost === undefined) d.originalCost = 0;
                }
            }
        });

        // Configuração de datas padrão para relatórios
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startInput = document.getElementById('rep-start');
        const endInput = document.getElementById('rep-end');
        if(startInput) startInput.value = firstDay.toISOString().split('T')[0];
        if(endInput) endInput.value = lastDay.toISOString().split('T')[0];

        APP.renderUserSelect();
    },

    /**
     * PERSISTÊNCIA DE DADOS
     */
    save: () => {
        // [TODO: SUPABASE] Substituir por chamadas de API (upsert/insert)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(APP.data));
        APP.renderAll();
    },

    /**
     * LOGS E HISTÓRICO
     */
    addLog: (obj, action, detail) => {
        if(!obj.history) obj.history = [];
        obj.history.push({
            date: Date.now(),
            user: APP.user ? APP.user.name : 'Sistema',
            action: action,
            detail: detail
        });
    },

    addHistory: (stockId, action, detail) => {
        if(!stockId) return;
        const item = APP.data.stock.find(s => s.id === stockId);
        if(item) APP.addLog(item, action, detail);
    },

    addDealHistory: (dealId, action, detail) => {
        if(!dealId) return;
        const d = APP.data.deals.find(x => x.id === dealId);
        if(d) APP.addLog(d, action, detail);
    },

    /**
     * INTERFACE UI / UX
     */
    toggleMenu: () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    },

    toast: (msg) => { 
        const t = document.getElementById('toast'); 
        t.innerText = msg; 
        t.style.opacity = 1; 
        setTimeout(()=>t.style.opacity=0, 3000); 
    },

    nav: (tab) => {
        // Fecha menu no mobile ao clicar
        document.getElementById('sidebar').classList.remove('open');
        
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        
        const tabEl = document.getElementById('tab-'+tab);
        const btnEl = document.getElementById('btn-'+tab);
        const titleEl = document.getElementById('page-title');

        if(tabEl) tabEl.classList.add('active');
        if(btnEl) btnEl.classList.add('active');
        if(titleEl) titleEl.innerText = tab.toUpperCase();
        
        if(tab === 'estoque') APP.renderStock();
        if(tab === 'funil') APP.renderKanban();
        if(tab === 'relatorios') APP.renderReports();
        if(tab === 'clientes') APP.renderClients();
        if(tab === 'agenda') APP.renderAgenda();
    },

    modal: (id) => {
        const m = document.getElementById(id);
        if(m) m.classList.add('active');
    },

    closeModals: () => { 
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
        document.querySelectorAll('form').forEach(f => f.reset()); 
    },

    /**
     * AUTENTICAÇÃO (SIMULADA)
     */
    login: (name) => {
        // [TODO: SUPABASE] Substituir por supabase.auth.signIn()
        APP.user = APP.data.users.find(u => u.name === name);
        document.getElementById('user-overlay').style.display = 'none';
        document.getElementById('user-info').innerText = APP.user.name;
        
        const isGestor = APP.user.role === 'gestor';
        const gestorBtns = document.querySelectorAll('.gestor-ctrl');
        gestorBtns.forEach(btn => btn.style.display = isGestor ? 'inline-block' : 'none');
        
        const filter = document.getElementById('filter-user');
        const sellerFilter = document.getElementById('rep-seller'); 

        if(isGestor) {
            filter.style.display = 'block';
            filter.innerHTML = '<option value="all">Ver Todos</option>';
            sellerFilter.innerHTML = '<option value="all">Todos</option>'; 
            
            APP.data.users.forEach(u => {
                const opt = `<option value="${u.name}">${u.name}</option>`;
                filter.innerHTML += opt;
                sellerFilter.innerHTML += opt;
            });
        } else { 
            filter.style.display = 'none'; 
        }
        
        APP.renderAll();
    },

    logout: () => { 
        document.getElementById('user-overlay').style.display = 'flex'; 
        APP.user = null; 
    },

    saveUser: (e) => {
        e.preventDefault();
        APP.data.users.push({ name: document.getElementById('usr-name').value, role: document.getElementById('usr-role').value });
        APP.save(); APP.closeModals();
    },

    renderUserSelect: () => { 
        document.getElementById('user-list-grid').innerHTML = APP.data.users.map(u => `<div class="user-select-card" onclick="APP.login('${u.name}')"><div style="font-weight:900;">${u.name}</div><div style="font-size:10px; color:#9ca3af; text-transform:uppercase;">${u.role}</div></div>`).join(''); 
    },

    renderUsers: () => {
        document.querySelector('#table-users tbody').innerHTML = APP.data.users.map(u => `<tr><td>${u.name}</td><td>${u.role}</td><td><button class="btn btn-small btn-danger" onclick="if(confirm('Excluir?')) {APP.data.users = APP.data.users.filter(x=>x.name!=='${u.name}'); APP.save();}">Excluir</button></td></tr>`).join('');
        
        const tbPerf = document.querySelector('#table-performance tbody');
        let ranking = [];

        tbPerf.innerHTML = APP.data.users.map(u => {
            const userDeals = APP.data.deals.filter(d => d.owner === u.name);
            const open = userDeals.filter(d => d.stage !== 'ganho' && d.stage !== 'perdido').length;
            const wonDeals = userDeals.filter(d => d.stage === 'ganho');
            const wonCount = wonDeals.length;
            const totalSales = wonDeals.reduce((a, b) => a + b.value, 0);
            const totalDeals = userDeals.length;
            const conversion = totalDeals > 0 ? ((wonCount / totalDeals) * 100).toFixed(1) : '0.0';

            if (u.role !== 'gestor') {
                ranking.push({name: u.name, total: totalSales});
            }

            return `<tr><td>${u.name}</td><td>${open}</td><td>${wonCount}</td><td><b>${conversion}%</b></td><td>${totalDeals}</td></tr>`;
        }).join('');

        ranking.sort((a,b) => b.total - a.total);
        document.getElementById('ranking-list').innerHTML = ranking.map((r, i) => `
            <div class="ranking-row">
                <div style="display:flex; align-items:center;">
                    <div class="ranking-pos">${i+1}</div>
                    <div class="ranking-name">${r.name}</div>
                </div>
                <div class="ranking-val">${r.total.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div>
            </div>
        `).join('');
    },

    /**
     * MÓDULO: CLIENTES
     */
    saveClient: (e) => {
        e.preventDefault();
        const id = document.getElementById('cli-id').value;
        const isNew = !id;
        const cliData = {
            id: id || '_' + Math.random().toString(36).substr(2,9),
            name: document.getElementById('cli-name').value,
            phone: document.getElementById('cli-phone').value,
            email: document.getElementById('cli-email').value,
            obs: document.getElementById('cli-obs').value
        };

        if (!isNew) {
            const idx = APP.data.clients.findIndex(c => c.id === id);
            APP.data.clients[idx] = cliData;
        } else {
            APP.data.clients.push(cliData);
        }
        APP.save(); APP.closeModals(); APP.renderClients();
    },
    
    deleteClient: (id) => {
            if(confirm('Excluir cliente?')) { 
            APP.data.clients = APP.data.clients.filter(c => c.id !== id); 
            APP.save(); 
            APP.renderClients();
            }
    },

    editClient: (id) => {
        const c = APP.data.clients.find(x => x.id === id);
        document.getElementById('cli-id').value = c.id;
        document.getElementById('cli-name').value = c.name;
        document.getElementById('cli-phone').value = c.phone;
        document.getElementById('cli-email').value = c.email;
        document.getElementById('cli-obs').value = c.obs;
        APP.modal('modal-client');
    },

    renderClients: () => {
        const term = document.getElementById('search-client').value.toLowerCase();
        const tbody = document.querySelector('#table-clients tbody');
        if(!tbody) return;

        const filtered = APP.data.clients.filter(c => c.name.toLowerCase().includes(term));
        
        tbody.innerHTML = filtered.map(c => `
            <tr>
                <td><b>${c.name}</b></td>
                <td style="display:flex; gap:5px; align-items:center;">
                    ${c.phone}
                    ${c.phone ? `<a href="#" onclick="APP.openWhatsapp('${c.phone}')" class="btn-whatsapp">Zap</a>` : ''}
                </td>
                <td>${c.email || '-'}</td>
                <td>${c.obs || '-'}</td>
                <td>
                    <button onclick="APP.editClient('${c.id}')" class="btn btn-small btn-main">✏️</button>
                    <button onclick="APP.deleteClient('${c.id}')" class="btn btn-small btn-danger">×</button>
                </td>
            </tr>
        `).join('');
    },

    /**
     * MÓDULO: ESTOQUE
     */
    importStock: (e) => {
        if(APP.user.role !== 'gestor') return alert('Acesso negado');
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.readAsText(file, 'ISO-8859-1');
        reader.onload = (evt) => {
            const text = evt.target.result;
            const lines = text.split('\n');
            let count = 0;
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const cols = line.split(';');
                if (cols.length >= 4) {
                    const model = cols[1];
                    const costStr = cols[3];
                    const dateStr = cols[4];
                    if (model && model !== 'N/A') {
                        const newId = '_' + Math.random().toString(36).substr(2,9);
                        const newItem = {
                            id: newId, type: cols[0], model: model, mono: cols[2],
                            cost: APP.parseMoney(costStr), date: APP.parseDateBR(dateStr),
                            status: 'Disponível', history: []
                        };
                        APP.data.stock.push(newItem);
                        APP.addHistory(newId, 'Importação', 'Item importado via CSV');
                        count++;
                    }
                }
            }
            APP.save();
            APP.toast(`${count} itens importados!`);
            e.target.value = '';
        };
    },

    saveStock: (e) => {
        e.preventDefault();
        if(APP.user.role !== 'gestor') return alert('Apenas gestores podem editar estoque.');

        const id = document.getElementById('stk-item-id-unique').value; 
        const isNew = !id;
        const itemData = {
            id: id || '_' + Math.random().toString(36).substr(2,9),
            type: document.getElementById('stk-type').value,
            model: document.getElementById('stk-model').value,
            mono: document.getElementById('stk-mono').value,
            cost: APP.parseMoney(document.getElementById('stk-cost').value),
            status: 'Disponível', date: Date.now(), history: []
        };

        if (!isNew) {
            const idx = APP.data.stock.findIndex(s => s.id === id);
            if(idx > -1) {
                const oldItem = APP.data.stock[idx];
                itemData.status = oldItem.status; 
                itemData.date = oldItem.date; 
                itemData.history = oldItem.history;
                APP.data.stock[idx] = itemData;
                APP.addHistory(itemData.id, 'Edição', 'Dados do item atualizados');
            }
        } else {
            itemData.status = 'Disponível';
            APP.data.stock.push(itemData);
            APP.addHistory(itemData.id, 'Criação', 'Cadastrado manualmente');
        }
        APP.save(); APP.closeModals();
    },

    prepareStock: () => {
        document.getElementById('stk-item-id-unique').value = ''; 
        document.getElementById('stk-model').value = '';
        document.getElementById('stk-mono').value = '';
        document.getElementById('stk-cost').value = '';
        document.getElementById('stk-date-display').value = '';
        document.getElementById('stk-type').selectedIndex = 0;
        APP.modal('modal-item');
    },

    restoreStock: (id) => {
        if(APP.user.role !== 'gestor') return alert('Acesso negado');
        if(confirm('Tem certeza? O item voltará a ficar DISPONÍVEL no estoque.')) {
            const item = APP.data.stock.find(s => s.id === id);
            if(item) {
                const deal = APP.data.deals.find(d => d.stockId === id && d.stage === 'ganho');
                if(deal) {
                    deal.stockId = null; 
                    APP.addDealHistory(deal.id, 'Desvinculo', 'Item restaurado ao estoque, removido desta venda.');
                }
                item.status = 'Disponível';
                APP.addHistory(item.id, 'Restauração', 'Item retornado de Vendido para Disponível manualmente');
                APP.save();
                APP.toast('Item restaurado para o estoque!');
            }
        }
    },

    deleteStock: (id) => { 
        if(APP.user.role !== 'gestor') return alert('Acesso negado');
        if(confirm('Excluir?')) { APP.data.stock = APP.data.stock.filter(s => s.id !== id); APP.save(); } 
    },

    editStock: (id) => { const s = APP.data.stock.find(x => x.id === id); document.getElementById('stk-item-id-unique').value = s.id; document.getElementById('stk-model').value = s.model; document.getElementById('stk-cost').value = s.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2}); APP.modal('modal-item'); },
    
    toggleStock: () => document.getElementById('div-stock-select').style.display = document.getElementById('deal-type').value === 'consorcio' ? 'none' : 'block',

    renderStock: () => {
        const term = document.getElementById('search-stock').value.toLowerCase();
        const tbody = document.querySelector('#table-stock tbody');
        const tbodySold = document.querySelector('#table-stock-sold tbody');
        let htmlBuffer = ''; 
        let htmlSold = '';
        
        const isGestor = APP.user.role === 'gestor';

        APP.data.stock.forEach(s => {
            if (s.model.toLowerCase().includes(term) || s.mono.toLowerCase().includes(term)) {
                if (s.status !== 'Vendido') {
                    const days = APP.daysDiff(s.date);
                    
                    let giroLabel = 'Saudável'; 
                    let giroStyle = 'background:#d1fae5; color:#065f46'; 

                    if (days > 365) { 
                        giroLabel = 'URGENTE'; 
                        giroStyle = 'background:#450a0a; color:#fecaca; font-weight:900;'; 
                    } else if (days > 210) {
                        giroLabel = 'Crítico'; 
                        giroStyle = 'background:#fee2e2; color:#991b1b; font-weight:bold;'; 
                    } else if (days > 150) {
                        giroLabel = 'Lento'; 
                        giroStyle = 'background:#ffedd5; color:#ea580c;'; 
                    } else if (days > 90) {
                        giroLabel = 'Atenção';
                        giroStyle = 'background:#fef3c7; color:#b45309;'; 
                    }
                    
                    // Visual Status Badge Logic
                    let statusBadgeClass = 'badge-success';
                    if (s.status === 'Reservado') statusBadgeClass = 'badge-warning';
                    
                    let actionHtml = '';
                    if(isGestor) {
                        actionHtml = `<button onclick="APP.editStock('${s.id}')" title="Editar" class="btn btn-small btn-main">✏️</button>
                                      <button onclick="APP.viewHistory('${s.id}', 'stock')" title="Histórico" class="btn btn-small btn-dark">📜</button>
                                      <button onclick="APP.deleteStock('${s.id}')" title="Excluir" class="btn btn-small btn-danger">×</button>`;
                    } else {
                        actionHtml = `<button onclick="APP.viewHistory('${s.id}', 'stock')" title="Histórico" class="btn btn-small btn-dark">📜 Detalhes</button>`;
                    }

                    htmlBuffer += `<tr>
                        <td>${s.type}</td>
                        <td><b>${s.model}</b></td>
                        <td>${s.mono}</td>
                        <td>${s.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                        <td>${days} dias</td>
                        <td><span style="padding:3px 6px; border-radius:4px; font-size:10px; ${giroStyle}">${giroLabel}</span></td>
                        <td><span class="badge ${statusBadgeClass}">${s.status}</span></td>
                        <td>${actionHtml}</td>
                    </tr>`;
                } else {
                    let restoreBtn = '';
                    if(isGestor) {
                        restoreBtn = `<button onclick="APP.restoreStock('${s.id}')" title="Restaurar para Disponível" class="btn btn-small btn-dark">♻️ Restaurar</button>`;
                    }
                    
                    const deal = APP.data.deals.find(d => d.stockId === s.id && d.stage === 'ganho');
                    const cliente = deal ? deal.client : '<span style="color:#9ca3af">Desconhecido</span>';
                    const dataVenda = deal && deal.closeDate ? new Date(deal.closeDate).toLocaleDateString('pt-BR') : '-';

                    htmlSold += `<tr>
                        <td>${dataVenda}</td>
                        <td><b>${s.model}</b></td>
                        <td>${s.mono}</td>
                        <td>${s.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                        <td>${cliente}</td>
                        <td>${restoreBtn}</td>
                    </tr>`;
                }
            }
        });
        tbody.innerHTML = htmlBuffer;
        if(tbodySold) tbodySold.innerHTML = htmlSold || '<tr><td colspan="6" style="text-align:center; padding:15px; color:#9ca3af;">Nenhum item vendido ou arquivado.</td></tr>';
    },

    /**
     * MÓDULO: NEGÓCIOS (FUNIL)
     */
    prepareDeal: (preselectedStockId = null) => {
        document.getElementById('deal-id').value = '';
        const sel = document.getElementById('deal-stock'); sel.innerHTML = '<option value="">Sem Máquina</option>';
        APP.data.stock.filter(s => s.status !== 'Vendido').forEach(s => { const selected = preselectedStockId === s.id ? 'selected' : ''; sel.innerHTML += `<option value="${s.id}" ${selected}>${s.model} - R$ ${s.cost}</option>`; });
        
        const dl = document.getElementById('list-clients');
        dl.innerHTML = APP.data.clients.map(c => `<option value="${c.name}">`).join('');
        
        APP.modal('modal-deal');
    },

    saveDeal: (e) => {
        e.preventDefault();
        const id = document.getElementById('deal-id').value;
        const stockId = document.getElementById('deal-stock').value;
        
        const dealData = {
            client: document.getElementById('deal-client').value,
            source: document.getElementById('deal-source').value,
            value: APP.parseMoney(document.getElementById('deal-value').value),
            stockId: stockId,
            nextDate: document.getElementById('deal-next-date').value,
            nextDesc: document.getElementById('deal-next-desc').value,
        };

        let dealId = id;
        let isNew = !id;

        if (isNew) {
            dealId = '_' + Math.random().toString(36).substr(2,9);
            const newDeal = {
                id: dealId, ...dealData, owner: APP.user.name, stage: 'prospeccao', history: []
            };
            APP.data.deals.push(newDeal);
            APP.addDealHistory(dealId, 'Criação', 'Oportunidade criada');
            
            if(dealData.nextDate) {
                const dateBr = dealData.nextDate.split('-').reverse().join('/');
                APP.addDealHistory(dealId, '📅 Agenda', `Ação inicial: ${dateBr} - ${dealData.nextDesc}`);
            }
        } else {
            const idx = APP.data.deals.findIndex(d => d.id === id);
            if (idx > -1) {
                const oldDeal = APP.data.deals[idx];
                
                if (oldDeal.stage === 'ganho' && dealData.stockId !== oldDeal.stockId) {
                        if (dealData.stockId) {
                        const s = APP.data.stock.find(x => x.id === dealData.stockId);
                        if (s) {
                            oldDeal.originalCost = s.cost;
                            if (s.status !== 'Vendido') s.status = 'Vendido';
                        }
                        } else {
                            oldDeal.originalCost = 0;
                        }
                }

                if(!oldDeal.history) oldDeal.history = [];
                if (dealData.nextDate && (dealData.nextDate !== oldDeal.nextDate || dealData.nextDesc !== oldDeal.nextDesc)) {
                    const dateBr = dealData.nextDate.split('-').reverse().join('/');
                    APP.addDealHistory(id, '📅 Agenda', `Nova ação proposta: ${dateBr} - ${dealData.nextDesc}`);
                }
                Object.assign(oldDeal, dealData);
            }
        }
        
        if(stockId) {
            const s = APP.data.stock.find(x => x.id === stockId);
            if(s && s.status !== 'Reservado' && s.status !== 'Vendido') {
                s.status = 'Reservado';
                APP.addHistory(stockId, 'Reservado', `Vinculado ao cliente ${dealData.client}`);
            }
        }

        APP.save(); APP.closeModals(); APP.nav('funil');
    },

    editDeal: (id) => { 
        const d = APP.data.deals.find(x => x.id === id); 
        if (!d) return; 
        APP.prepareDeal(d.stockId); 
        document.getElementById('deal-id').value = d.id; 
        document.getElementById('deal-client').value = d.client; 
        document.getElementById('deal-source').value = d.source || 'Loja/Passante';
        document.getElementById('deal-value').value = d.value.toLocaleString('pt-BR', {minimumFractionDigits:2}); 
        document.getElementById('deal-type').value = d.stockId ? 'maquina' : 'consorcio'; 
        document.getElementById('deal-next-date').value = d.nextDate || ''; 
        document.getElementById('deal-next-desc').value = d.nextDesc || ''; 
        APP.toggleStock();
    },

    deleteDeal: (id) => {
        if(confirm('Tem certeza que deseja EXCLUIR esta oportunidade?')) {
            const deal = APP.data.deals.find(d => d.id === id);
            if(deal && deal.stockId) {
                const s = APP.data.stock.find(x => x.id === deal.stockId);
                if(s && s.status === 'Reservado') {
                    s.status = 'Disponível';
                    APP.addHistory(s.id, 'Liberação', 'Oportunidade excluída');
                }
            }
            APP.data.deals = APP.data.deals.filter(d => d.id !== id);
            APP.save(); APP.renderKanban(); APP.renderKPIs(); APP.toast('Oportunidade excluída!');
        }
    },

    updateStage: (id, stage) => {
        const deal = APP.data.deals.find(d => d.id === id);
        if (!deal) return;
        const oldStage = deal.stage;
        let motivoPerda = '';
        
        if (stage === 'perdido') {
            motivoPerda = prompt("Qual o motivo da perda? (Ex: Preço, Crédito, Concorrência...)");
            if (motivoPerda === null) { APP.renderKanban(); return; }
            if (motivoPerda.trim() === '') motivoPerda = 'Não informado';
            deal.nextDesc = `⛔ PERDA: ${motivoPerda}`;
            deal.nextDate = new Date().toISOString().split('T')[0];
        }

        if (stage === 'ganho' && oldStage !== 'ganho') {
            deal.closeDate = Date.now();
            if (deal.stockId) {
                const s = APP.data.stock.find(x => x.id === deal.stockId);
                if (s) deal.originalCost = s.cost;
            } else {
                deal.originalCost = 0;
            }
        }

        deal.stage = stage;
        APP.addDealHistory(deal.id, 'Movimentação', `Mudou de ${oldStage.toUpperCase()} para ${stage.toUpperCase()}` + (motivoPerda ? ` (${motivoPerda})` : ''));

        if (deal.stockId) {
            const s = APP.data.stock.find(x => x.id === deal.stockId);
            if (s) {
                if (stage === 'ganho') {
                    s.status = 'Vendido';
                    APP.addHistory(deal.stockId, 'Venda', `Negócio fechado com ${deal.client}`);
                } else if (stage === 'perdido') {
                    s.status = 'Disponível';
                    APP.addHistory(deal.stockId, 'Perda', `Motivo: ${motivoPerda} (Cliente: ${deal.client})`);
                } else {
                    if(s.status !== 'Reservado') {
                        s.status = 'Reservado';
                        APP.addHistory(deal.stockId, 'Reserva', `Reativado no funil`);
                    }
                }
            }
        }
        APP.save();
    },

    renderKanban: () => {
        const cols = [{id:'prospeccao', l:'Prospecção', c:'#3b82f6'},{id:'analise_credito', l:'Análise Crédito', c:'#0ea5e9'},{id:'documentacao', l:'Documentação', c:'#eab308'},{id:'contrato', l:'Contrato', c:'#f97316'},{id:'af', l:'A.F.', c:'#8b5cf6'},{id:'ganho', l:'Ganho', c:'#10b981'},{id:'perdido', l:'Perdido', c:'#374151'}];
        const container = document.getElementById('kanban-board');
        container.innerHTML = '';
        
        let deals = APP.data.deals;
        if (APP.user.role === 'gestor') { 
            const f = document.getElementById('filter-user').value; 
            if (f !== 'all') deals = deals.filter(d => d.owner === f); 
        } else { 
            deals = deals.filter(d => d.owner === APP.user.name); 
        }

        cols.forEach(c => {
            const items = deals.filter(d => d.stage === c.id);
            const totalCol = items.reduce((acc, curr) => acc + curr.value, 0);

            const div = document.createElement('div'); div.className = 'kanban-col';
            div.ondragover = e => { e.preventDefault(); div.classList.add('drag-over'); };
            div.ondragleave = e => div.classList.remove('drag-over');
            div.ondrop = e => { e.preventDefault(); div.classList.remove('drag-over'); if(APP.dragId) APP.updateStage(APP.dragId, c.id); };
            
            let html = `<div class="kanban-header" style="background:${c.c}">
                            <div>${c.l} (${items.length})</div>
                            <div class="kanban-header-total">${totalCol.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div>
                        </div>
                        <div class="kanban-list">`;
            
            items.forEach(d => {
                let actionHtml = '';
                if(d.stage === 'perdido' && d.nextDesc && d.nextDesc.includes('PERDA')) { actionHtml = `<div class="card-action" style="color:#991b1b; font-weight:800; background:#fee2e2;">${d.nextDesc}</div>`; }
                else if(d.nextDate) {
                    const today = new Date().toISOString().split('T')[0];
                    const color = d.nextDate < today ? '#ef4444' : '#2563eb';
                    const dateBr = d.nextDate.split('-').reverse().join('/');
                    actionHtml = `<div class="card-action" style="color:${color}">📅 ${dateBr} - ${d.nextDesc}</div>`;
                }
                html += `<div class="card" draggable="true" onclick="APP.editDeal('${d.id}')" ondragstart="APP.dragId='${d.id}'; this.classList.add('dragging')" ondragend="this.classList.remove('dragging')"><div class="card-tags"><span class="tag">👤 ${d.owner}</span><div class="card-btn-group"><button class="btn-card-icon" onclick="event.stopPropagation(); APP.viewHistory('${d.id}', 'deal')" title="Histórico">📜</button><button class="btn-card-icon btn-card-delete" onclick="event.stopPropagation(); APP.deleteDeal('${d.id}')" title="Excluir">🗑️</button></div></div><div style="font-weight:800; margin-bottom:5px;">${d.client}</div><div style="font-weight:700; color:#374151;">${d.value.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>${actionHtml}</div>`;
            });
            html += '</div>'; div.innerHTML = html; container.appendChild(div);
        });
    },

    /**
     * MÓDULO: AGENDA
     */
    renderAgenda: () => {
        const container = document.getElementById('agenda-content');
        if(!container) return;

        let deals = APP.data.deals.filter(d => d.stage !== 'ganho' && d.stage !== 'perdido' && d.nextDate);
        if (APP.user.role !== 'gestor') { 
            deals = deals.filter(d => d.owner === APP.user.name); 
        }

        if(deals.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#9ca3af;">Nenhuma tarefa agendada.</div>';
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const delayed = [];
        const todayList = [];
        const future = [];

        deals.sort((a,b) => a.nextDate.localeCompare(b.nextDate));

        deals.forEach(d => {
            if (d.nextDate < today) delayed.push(d);
            else if (d.nextDate === today) todayList.push(d);
            else future.push(d);
        });

        const buildList = (title, list, className) => {
            if(list.length === 0) return '';
            let html = `<div class="agenda-group"><h4>${title} (${list.length})</h4>`;
            list.forEach(d => {
                const dateBr = d.nextDate.split('-').reverse().join('/');
                html += `
                    <div class="agenda-item ${className}" onclick="APP.editDeal('${d.id}')" style="cursor:pointer">
                        <div class="agenda-date">${dateBr}</div>
                        <div class="agenda-info">
                            <div class="agenda-client">${d.client}</div>
                            <div class="agenda-desc">${d.nextDesc || 'Sem descrição'}</div>
                        </div>
                        <div style="font-size:10px; font-weight:700; background:#f3f4f6; padding:2px 5px; border-radius:3px; text-transform:uppercase;">${d.owner}</div>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        };

        container.innerHTML = 
            buildList('⚠ Atrasadas', delayed, 'delayed') +
            buildList('📅 Hoje', todayList, 'today') +
            buildList('🚀 Próximas', future, 'future');
    },

    /**
     * MÓDULO: RELATÓRIOS E KPIs
     */
    renderKPIs: () => {
        const isGestor = APP.user.role === 'gestor';
        const scopeDeals = isGestor ? APP.data.deals : APP.data.deals.filter(d => d.owner === APP.user.name);

        const wonDeals = scopeDeals.filter(d => d.stage === 'ganho');
        const totalRevenue = wonDeals.reduce((a,b) => a+b.value, 0);
        document.getElementById('lbl-faturamento').innerText = isGestor ? "Faturamento (Total)" : "Meu Faturamento";
        document.getElementById('kpi-total').innerText = totalRevenue.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        
        let totalMargin = 0;
        wonDeals.forEach(d => {
            let cost = 0;
            if (d.originalCost !== undefined) {
                cost = d.originalCost;
            } else if (d.stockId) {
                const stockItem = APP.data.stock.find(s => s.id === d.stockId);
                if (stockItem) {
                    cost = stockItem.cost;
                }
            }
            totalMargin += (d.value - cost);
        });
        
        let marginPct = 0;
        if (totalRevenue > 0) {
            marginPct = (totalMargin / totalRevenue) * 100;
        }
        const pctColor = marginPct >= 0 ? '#10b981' : '#ef4444';

        document.getElementById('kpi-margin').innerHTML = `
            ${totalMargin.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})} 
            <span style="font-size:14px; color:${pctColor}; margin-left:5px;">(${marginPct.toFixed(1)}%)</span>
        `;

        const openDealsList = scopeDeals.filter(d => d.stage !== 'ganho' && d.stage !== 'perdido');
        const pipelineValue = openDealsList.reduce((a,b) => a+b.value, 0);
        document.getElementById('kpi-pipeline').innerText = pipelineValue.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

        const gridContainer = document.getElementById('dash-inventory-grid');
        
        if (!isGestor) {
            gridContainer.innerHTML = '';
            return;
        }

        const blockedStock = APP.data.stock.filter(s => s.status === 'Reservado');
        const blockedValue = blockedStock.reduce((a, b) => a + b.cost, 0);
        const availableStock = APP.data.stock.filter(s => s.status === 'Disponível');
        
        const types = {};
        let totalStockValue = 0;
        let criticalValue = 0;

        availableStock.forEach(s => {
            if(!types[s.type]) types[s.type] = 0;
            types[s.type] += s.cost;
            totalStockValue += s.cost;
            if(APP.daysDiff(s.date) > 365) criticalValue += s.cost;
        });

        let gridHtml = '';
        gridHtml += `<div class="inv-card"><div class="inv-label">💰 Estoque Total</div><div class="inv-value">${totalStockValue.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div></div>`;
        for (const [type, val] of Object.entries(types)) {
            gridHtml += `<div class="inv-card"><div class="inv-label">🚜 ${type}</div><div class="inv-value" style="font-size:16px;">${val.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div></div>`;
        }
        gridHtml += `<div class="inv-card blocked"><div class="inv-label">🔒 Reservado/Em Disputa</div><div class="inv-value">${blockedValue.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div></div>`;
        gridHtml += `<div class="inv-card critical"><div class="inv-label">🚨 Capital Crítico (>365d)</div><div class="inv-value">${criticalValue.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div></div>`;

        gridContainer.innerHTML = gridHtml;
    },

    renderReports: () => {
        const startStr = document.getElementById('rep-start').value;
        const endStr = document.getElementById('rep-end').value;
        const sourceFilter = document.getElementById('rep-source').value;
        const sellerFilter = document.getElementById('rep-seller').value;

        if(!startStr || !endStr) return;
        const startDate = new Date(startStr).getTime();
        const endDate = new Date(endStr).getTime() + 86400000;

        const tbody = document.querySelector('#table-reports tbody');
        let html = '';
        let totalVal = 0;
        let count = 0;

        APP.data.deals.forEach(d => {
            const dealDate = d.closeDate || (d.history && d.history[0] ? d.history[0].date : 0);
            
            if (d.stage === 'ganho' && dealDate >= startDate && dealDate < endDate) {
                if (sourceFilter !== 'all' && d.source !== sourceFilter) return;
                if (APP.user.role !== 'gestor' && d.owner !== APP.user.name) return;
                if (APP.user.role === 'gestor' && sellerFilter !== 'all' && d.owner !== sellerFilter) return;

                totalVal += d.value;
                count++;
                let prodName = 'Consórcio/Serviço';
                let cost = 0;

                if(d.stockId) {
                    const s = APP.data.stock.find(x => x.id === d.stockId);
                    if(s) prodName = s.model;
                }
                
                if (d.originalCost !== undefined) {
                    cost = d.originalCost;
                } else if (d.stockId) {
                    const stockItem = APP.data.stock.find(s => s.id === d.stockId);
                    if (stockItem) cost = stockItem.cost;
                }

                const marginVal = d.value - cost;
                const marginPct = d.value > 0 ? ((marginVal / d.value) * 100).toFixed(1) + '%' : '0%';
                const marginColor = marginVal >= 0 ? '#10b981' : '#ef4444';

                const dateBr = new Date(dealDate).toLocaleDateString('pt-BR');
                
                html += `<tr>
                    <td>${dateBr}</td>
                    <td><b>${d.client}</b></td>
                    <td>${d.source || '-'}</td>
                    <td>${d.owner}</td>
                    <td>${prodName}</td>
                    <td>${d.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td style="color:${marginColor}; font-weight:bold;">${marginVal.toLocaleString('pt-BR', {minimumFractionDigits: 2})} <small>(${marginPct})</small></td>
                </tr>`;
            }
        });

        if(count === 0) html = '<tr><td colspan="7" style="text-align:center; padding:20px;">Nenhuma venda encontrada com estes filtros.</td></tr>';
        tbody.innerHTML = html;
        document.getElementById('rep-total-val').innerText = totalVal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
        document.getElementById('rep-total-count').innerText = count;
    },

    viewHistory: (id, type) => {
        let list = []; let title = '';
        if (type === 'stock') {
            const item = APP.data.stock.find(s => s.id === id);
            if(item) { list = item.history || []; title = `Histórico: ${item.model}`; }
        } else {
            const deal = APP.data.deals.find(d => d.id === id);
            if(deal) { list = deal.history || []; title = `Histórico: ${deal.client}`; }
        }
        document.getElementById('hist-title').innerText = title;
        const container = document.getElementById('history-content');
        if(!list || list.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#9ca3af; padding:20px;">Sem histórico registrado.</div>';
        } else {
            container.innerHTML = list.sort((a,b) => b.date - a.date).map(h => {
                const dateObj = new Date(h.date);
                const dateStr = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
                return `<div class="timeline-item"><div class="timeline-date">${dateStr}</div><div class="timeline-action">${h.action}</div><div class="timeline-detail">${h.detail}</div><div class="timeline-user">Por: ${h.user || 'Sistema'}</div></div>`;
            }).join('');
        }
        APP.modal('modal-history');
    },

    /**
     * UTILITÁRIOS
     */
    parseMoney: (v) => {
        if (typeof v === 'number') return v;
        if (!v) return 0;
        return parseFloat(v.toString().replace(/[R$€\s]/g, '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    },
    parseDateBR: (dateStr) => {
        if (!dateStr) return Date.now();
        const parts = dateStr.trim().split('/');
        if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]).getTime();
        return Date.now();
    },
    daysDiff: (ts) => Math.floor((Date.now() - ts) / 86400000),
    maskMoney: (i) => {
        let v = i.value.replace(/\D/g, '');
        v = (v/100).toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        i.value = v;
    },
    inputPhone: (i) => {
        let v = i.value.replace(/\D/g,"");
        v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
        v = v.replace(/(\d)(\d{4})$/,"$1-$2");
        i.value = v;
    },
    openWhatsapp: (phone) => {
        if(!phone) return alert('Sem telefone cadastrado');
        const num = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${num}`, '_blank');
    },
    exportData: () => { 
        const wb = XLSX.utils.book_new(); 
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(APP.data.stock), "Estoque"); 
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(APP.data.deals), "Negócios"); 
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(APP.data.clients), "Clientes");
        XLSX.writeFile(wb, "YattaCRM_Backup.xlsx"); 
    },
    renderAll: () => { APP.renderStock(); APP.renderKanban(); APP.renderUsers(); APP.renderKPIs(); APP.renderClients(); APP.renderAgenda(); },
};

// INICIA O APP
document.addEventListener('DOMContentLoaded', APP.init);