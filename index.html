/**
 * YATTA CRM - v3.9.15 (CLOUD)
 * Conectado ao Supabase (PostgreSQL)
 */

// CREDENCIAIS DO SUPABASE
const SUPABASE_URL = 'https://igvdhpzzjamoyetxickb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mXmrR5peC1mICxxMxjDKrg_2NJUZG0Q'; // Chave fornecida

// Inicializa o cliente Supabase
// (Certifique-se de ter adicionado o script do supabase-js no HTML)
let supabase;
if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error("ERRO CRÍTICO: Biblioteca Supabase não encontrada. Adicione <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> no seu HTML.");
}

const APP = {
    // Estado Local (Cache para renderização rápida)
    data: { stock: [], users: [], deals: [], clients: [] },
    user: null,
    dragId: null,

    /**
     * INICIALIZAÇÃO (Carrega dados da Nuvem)
     */
    init: async () => {
        if (!supabase) return alert("Erro: Biblioteca Supabase não carregada.");

        // Carrega dados em paralelo para ser mais rápido
        const [usersReq, clientsReq, stockReq, dealsReq] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('clients').select('*'),
            supabase.from('stock').select('*'),
            supabase.from('deals').select('*')
        ]);

        if (usersReq.error) console.error("Erro Users:", usersReq.error);
        if (clientsReq.error) console.error("Erro Clients:", clientsReq.error);
        
        APP.data.users = usersReq.data || [];
        APP.data.clients = clientsReq.data || [];
        APP.data.stock = stockReq.data || [];
        APP.data.deals = dealsReq.data || [];

        // Se não houver usuários (primeiro uso), cria o padrão na memória para login
        if (APP.data.users.length === 0) {
            // Opcional: Criar usuário padrão no banco se estiver vazio
            // await APP.saveUserDirect({name: 'Gestor Inicial', role: 'gestor'});
            APP.data.users.push({name: 'Gestor Inicial', role: 'gestor'}); 
        }

        // Configura datas dos filtros
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startInput = document.getElementById('rep-start');
        const endInput = document.getElementById('rep-end');
        if(startInput) startInput.value = firstDay.toISOString().split('T')[0];
        if(endInput) endInput.value = lastDay.toISOString().split('T')[0];

        APP.renderUserSelect();
        APP.renderAll(); // Renderiza com os dados carregados
    },

    /**
     * UTILITÁRIOS
     */
    // Gera UUID compatível com o banco (v4)
    uuid: () => {
        return crypto.randomUUID(); 
    },

    // Função auxiliar para atualizar o estado local e re-renderizar
    refreshLocal: (table, item, isDelete = false) => {
        if (isDelete) {
            APP.data[table] = APP.data[table].filter(i => i.id !== item.id);
        } else {
            const idx = APP.data[table].findIndex(i => i.id === item.id);
            if (idx > -1) {
                APP.data[table][idx] = item; // Atualiza existente
            } else {
                APP.data[table].push(item); // Adiciona novo
            }
        }
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
        return obj.history;
    },

    // Helpers para salvar histórico no banco
    addHistory: async (stockId, action, detail) => {
        const item = APP.data.stock.find(s => s.id === stockId);
        if(!item) return;
        const newHistory = APP.addLog(item, action, detail);
        // Atualiza apenas o campo history no banco
        await supabase.from('stock').update({ history: newHistory }).eq('id', stockId);
    },

    addDealHistory: async (dealId, action, detail) => {
        const item = APP.data.deals.find(d => d.id === dealId);
        if(!item) return;
        const newHistory = APP.addLog(item, action, detail);
        await supabase.from('deals').update({ history: newHistory }).eq('id', dealId);
    },

    /**
     * INTERFACE UI / UX
     */
    toggleMenu: () => {
        document.getElementById('sidebar').classList.toggle('open');
    },

    toast: (msg) => { 
        const t = document.getElementById('toast'); 
        t.innerText = msg; 
        t.style.opacity = 1; 
        setTimeout(()=>t.style.opacity=0, 3000); 
    },

    nav: (tab) => {
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

    modal: (id) => document.getElementById(id).classList.add('active'),
    closeModals: () => { 
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
        document.querySelectorAll('form').forEach(f => f.reset()); 
    },

    /**
     * AUTENTICAÇÃO
     */
    login: (name) => {
        APP.user = APP.data.users.find(u => u.name === name);
        if (!APP.user) return alert("Usuário não encontrado.");

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

    saveUser: async (e) => {
        e.preventDefault();
        const userData = { 
            name: document.getElementById('usr-name').value, 
            role: document.getElementById('usr-role').value 
        };
        
        const { data, error } = await supabase.from('users').insert(userData).select();
        
        if(error) return alert("Erro ao salvar usuário: " + error.message);
        
        APP.refreshLocal('users', data[0]);
        APP.closeModals();
        APP.toast('Usuário salvo!');
    },

    renderUserSelect: () => { 
        document.getElementById('user-list-grid').innerHTML = APP.data.users.map(u => `<div class="user-select-card" onclick="APP.login('${u.name}')"><div style="font-weight:900;">${u.name}</div><div style="font-size:10px; color:#9ca3af; text-transform:uppercase;">${u.role}</div></div>`).join(''); 
    },

    renderUsers: () => {
        // Tabela de usuários
        document.querySelector('#table-users tbody').innerHTML = APP.data.users.map(u => `<tr><td>${u.name}</td><td>${u.role}</td><td><button class="btn btn-small btn-danger" onclick="APP.deleteUser(${u.id})">Excluir</button></td></tr>`).join('');
        
        // Performance
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

    deleteUser: async (id) => {
        if(confirm('Excluir usuário?')) {
            const { error } = await supabase.from('users').delete().eq('id', id);
            if(error) return alert("Erro: " + error.message);
            // Atualiza local
            APP.data.users = APP.data.users.filter(u => u.id !== id);
            APP.renderUsers();
            APP.renderUserSelect();
        }
    },

    /**
     * MÓDULO: CLIENTES
     */
    saveClient: async (e) => {
        e.preventDefault();
        const id = document.getElementById('cli-id').value;
        
        const cliData = {
            name: document.getElementById('cli-name').value,
            phone: document.getElementById('cli-phone').value,
            email: document.getElementById('cli-email').value,
            obs: document.getElementById('cli-obs').value
        };

        if (id) cliData.id = id; // Update

        const { data, error } = await supabase.from('clients').upsert(cliData).select();
        
        if(error) return alert("Erro ao salvar cliente: " + error.message);

        APP.refreshLocal('clients', data[0]);
        APP.closeModals(); 
    },
    
    deleteClient: async (id) => {
        if(confirm('Excluir cliente?')) { 
            const { error } = await supabase.from('clients').delete().eq('id', id);
            if(error) return alert("Erro: " + error.message);
            APP.refreshLocal('clients', {id}, true);
        }
    },

    editClient: (id) => {
        const c = APP.data.clients.find(x => x.id === id);
        if(!c) return;
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
        reader.onload = async (evt) => {
            const text = evt.target.result;
            const lines = text.split('\n');
            let count = 0;
            const newItems = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const cols = line.split(';');
                if (cols.length >= 4) {
                    const model = cols[1];
                    const costStr = cols[3];
                    const dateStr = cols[4];
                    if (model && model !== 'N/A') {
                        // Converter data DD/MM/AAAA para YYYY-MM-DD para o Banco
                        let dbDate = new Date().toISOString(); 
                        if(dateStr) {
                            const parts = dateStr.trim().split('/');
                            if(parts.length === 3) dbDate = new Date(parts[2], parts[1]-1, parts[0]).toISOString();
                        }

                        newItems.push({
                            type: cols[0], 
                            model: model, 
                            mono: cols[2],
                            cost: APP.parseMoney(costStr), 
                            date_entry: dbDate,
                            status: 'Disponível', 
                            history: [{date: Date.now(), user: APP.user.name, action: 'Importação', detail: 'Via CSV'}]
                        });
                        count++;
                    }
                }
            }

            if(newItems.length > 0) {
                const { data, error } = await supabase.from('stock').insert(newItems).select();
                if(error) alert("Erro na importação: " + error.message);
                else {
                    APP.data.stock.push(...data);
                    APP.toast(`${count} itens importados!`);
                    APP.renderStock();
                }
            }
            e.target.value = '';
        };
    },

    saveStock: async (e) => {
        e.preventDefault();
        if(APP.user.role !== 'gestor') return alert('Apenas gestores podem editar estoque.');

        const id = document.getElementById('stk-item-id-unique').value; 
        
        const itemData = {
            type: document.getElementById('stk-type').value,
            model: document.getElementById('stk-model').value,
            mono: document.getElementById('stk-mono').value,
            cost: APP.parseMoney(document.getElementById('stk-cost').value)
        };

        if (id) {
            itemData.id = id;
            // Edição: Mantém histórico e status
            APP.addHistory(id, 'Edição', 'Dados atualizados'); // Atualiza histórico via função separada
            // Salva dados básicos
            const { data, error } = await supabase.from('stock').update(itemData).eq('id', id).select();
            if(!error) APP.refreshLocal('stock', data[0]);
        } else {
            // Novo
            itemData.status = 'Disponível';
            itemData.date_entry = new Date().toISOString();
            itemData.history = [{date: Date.now(), user: APP.user.name, action: 'Criação', detail: 'Manual'}];
            
            const { data, error } = await supabase.from('stock').insert(itemData).select();
            if(error) return alert("Erro: " + error.message);
            APP.refreshLocal('stock', data[0]);
        }
        
        APP.closeModals();
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

    restoreStock: async (id) => {
        if(APP.user.role !== 'gestor') return alert('Acesso negado');
        if(confirm('Restaurar para Disponível?')) {
            const item = APP.data.stock.find(s => s.id === id);
            if(item) {
                // Remove vínculo da venda
                const deal = APP.data.deals.find(d => d.stock_id === id && d.stage === 'ganho');
                if(deal) {
                    await supabase.from('deals').update({stock_id: null}).eq('id', deal.id);
                    APP.addDealHistory(deal.id, 'Desvinculo', 'Item restaurado ao estoque.');
                    deal.stock_id = null; // Update local deal
                }

                // Atualiza item
                item.status = 'Disponível';
                APP.addLog(item, 'Restauração', 'Manual'); // Update local history array
                
                const { error } = await supabase.from('stock').update({
                    status: 'Disponível', 
                    history: item.history
                }).eq('id', id);

                if(!error) {
                    APP.toast('Item restaurado!');
                    APP.renderStock();
                }
            }
        }
    },

    deleteStock: async (id) => { 
        if(APP.user.role !== 'gestor') return alert('Acesso negado');
        if(confirm('Excluir permanentemente?')) { 
            const { error } = await supabase.from('stock').delete().eq('id', id);
            if(error) return alert("Erro: " + error.message);
            APP.refreshLocal('stock', {id}, true);
        } 
    },

    editStock: (id) => { 
        const s = APP.data.stock.find(x => x.id === id); 
        document.getElementById('stk-item-id-unique').value = s.id; 
        document.getElementById('stk-model').value = s.model; 
        document.getElementById('stk-mono').value = s.mono; // Fix: was missing
        document.getElementById('stk-cost').value = s.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2}); 
        APP.modal('modal-item'); 
    },
    
    toggleStock: () => document.getElementById('div-stock-select').style.display = document.getElementById('deal-type').value === 'consorcio' ? 'none' : 'block',

    renderStock: () => {
        const term = document.getElementById('search-stock').value.toLowerCase();
        const tbody = document.querySelector('#table-stock tbody');
        const tbodySold = document.querySelector('#table-stock-sold tbody');
        let htmlBuffer = ''; 
        let htmlSold = '';
        
        const isGestor = APP.user.role === 'gestor';

        APP.data.stock.forEach(s => {
            if (s.model.toLowerCase().includes(term) || (s.mono && s.mono.toLowerCase().includes(term))) {
                // Use date_entry from DB or fallback
                const entryDate = s.date_entry ? new Date(s.date_entry).getTime() : Date.now();
                
                if (s.status !== 'Vendido') {
                    const days = APP.daysDiff(entryDate);
                    
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
                        <td>${s.mono || '-'}</td>
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
                    
                    const deal = APP.data.deals.find(d => d.stock_id === s.id && d.stage === 'ganho');
                    const cliente = deal ? deal.client : '<span style="color:#9ca3af">Desconhecido</span>';
                    const dataVenda = deal && deal.close_date ? new Date(deal.close_date).toLocaleDateString('pt-BR') : '-';

                    htmlSold += `<tr>
                        <td>${dataVenda}</td>
                        <td><b>${s.model}</b></td>
                        <td>${s.mono || '-'}</td>
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

    saveDeal: async (e) => {
        e.preventDefault();
        const id = document.getElementById('deal-id').value;
        const stockId = document.getElementById('deal-stock').value || null; // Ensure null if empty
        
        const dealData = {
            client: document.getElementById('deal-client').value,
            source: document.getElementById('deal-source').value,
            value: APP.parseMoney(document.getElementById('deal-value').value),
            stock_id: stockId, // Note: Snake_case for DB
            next_date: document.getElementById('deal-next-date').value || null,
            next_desc: document.getElementById('deal-next-desc').value,
            owner: APP.user.name // Ensure owner is saved
        };

        if (id) {
            // Update
            dealData.id = id;
            
            // Check logic for stock change
            const oldDeal = APP.data.deals.find(d => d.id === id);
            if(oldDeal && oldDeal.stage === 'ganho' && dealData.stock_id !== oldDeal.stock_id) {
                // If changing stock on a won deal, update costs
                if(dealData.stock_id) {
                    const s = APP.data.stock.find(x => x.id === dealData.stock_id);
                    if(s) dealData.original_cost = s.cost;
                } else {
                    dealData.original_cost = 0;
                }
            }

            // History logic
            if(!oldDeal.history) oldDeal.history = [];
            let newHist = oldDeal.history;
            if (dealData.next_date && (dealData.next_date !== oldDeal.next_date || dealData.next_desc !== oldDeal.next_desc)) {
                const dateBr = dealData.next_date.split('-').reverse().join('/');
                newHist.push({date: Date.now(), user: APP.user.name, action: 'Agenda', detail: `Nova ação: ${dateBr} - ${dealData.next_desc}`});
            }
            dealData.history = newHist;

            const { data, error } = await supabase.from('deals').update(dealData).eq('id', id).select();
            if(error) return alert("Erro: " + error.message);
            APP.refreshLocal('deals', data[0]);

        } else {
            // Insert
            dealData.stage = 'prospeccao';
            dealData.history = [{date: Date.now(), user: APP.user.name, action: 'Criação', detail: 'Oportunidade criada'}];
            
            if(dealData.next_date) {
                const dateBr = dealData.next_date.split('-').reverse().join('/');
                dealData.history.push({date: Date.now(), user: APP.user.name, action: 'Agenda', detail: `Inicial: ${dateBr} - ${dealData.next_desc}`});
            }

            const { data, error } = await supabase.from('deals').insert(dealData).select();
            if(error) return alert("Erro: " + error.message);
            APP.refreshLocal('deals', data[0]);
        }
        
        // Update Stock Status
        if(stockId) {
            const s = APP.data.stock.find(x => x.id === stockId);
            if(s && s.status !== 'Reservado' && s.status !== 'Vendido') {
                const newHist = APP.addLog(s, 'Reservado', `Vinculado ao cliente ${dealData.client}`);
                await supabase.from('stock').update({status: 'Reservado', history: newHist}).eq('id', stockId);
                s.status = 'Reservado'; // Local update
            }
        }

        APP.closeModals(); 
        APP.nav('funil');
    },

    editDeal: (id) => { 
        const d = APP.data.deals.find(x => x.id === id); 
        if (!d) return; 
        APP.prepareDeal(d.stock_id); // Note: stock_id
        document.getElementById('deal-id').value = d.id; 
        document.getElementById('deal-client').value = d.client; 
        document.getElementById('deal-source').value = d.source || 'Loja/Passante';
        document.getElementById('deal-value').value = d.value.toLocaleString('pt-BR', {minimumFractionDigits:2}); 
        document.getElementById('deal-type').value = d.stock_id ? 'maquina' : 'consorcio'; 
        document.getElementById('deal-next-date').value = d.next_date || ''; 
        document.getElementById('deal-next-desc').value = d.next_desc || ''; 
        APP.toggleStock();
    },

    deleteDeal: async (id) => {
        if(confirm('Excluir oportunidade?')) {
            const deal = APP.data.deals.find(d => d.id === id);
            
            const { error } = await supabase.from('deals').delete().eq('id', id);
            if(error) return alert("Erro: " + error.message);

            if(deal && deal.stock_id) {
                const s = APP.data.stock.find(x => x.id === deal.stock_id);
                if(s && s.status === 'Reservado') {
                    const newHist = APP.addLog(s, 'Liberação', 'Oportunidade excluída');
                    await supabase.from('stock').update({status: 'Disponível', history: newHist}).eq('id', s.id);
                    s.status = 'Disponível';
                }
            }
            
            APP.refreshLocal('deals', {id}, true);
            APP.toast('Oportunidade excluída!');
        }
    },

    updateStage: async (id, stage) => {
        const deal = APP.data.deals.find(d => d.id === id);
        if (!deal) return;
        const oldStage = deal.stage;
        let motivoPerda = '';
        
        let updates = { stage: stage };

        if (stage === 'perdido') {
            motivoPerda = prompt("Motivo da perda?");
            if (motivoPerda === null) { APP.renderKanban(); return; }
            if (!motivoPerda) motivoPerda = 'Não informado';
            updates.next_desc = `⛔ PERDA: ${motivoPerda}`;
            updates.next_date = new Date().toISOString().split('T')[0];
        }

        if (stage === 'ganho' && oldStage !== 'ganho') {
            updates.close_date = new Date().toISOString();
            if (deal.stock_id) {
                const s = APP.data.stock.find(x => x.id === deal.stock_id);
                if (s) updates.original_cost = s.cost;
            } else {
                updates.original_cost = 0;
            }
        }

        // History
        let newHistory = APP.addLog(deal, 'Movimentação', `De ${oldStage.toUpperCase()} para ${stage.toUpperCase()}` + (motivoPerda ? ` (${motivoPerda})` : ''));
        updates.history = newHistory;

        // DB Update
        const { error } = await supabase.from('deals').update(updates).eq('id', id);
        if(error) return alert("Erro: " + error.message);

        // Update Local
        Object.assign(deal, updates);

        // Stock Effects
        if (deal.stock_id) {
            const s = APP.data.stock.find(x => x.id === deal.stock_id);
            if (s) {
                let sUpdates = {};
                let sAction = '';
                if (stage === 'ganho') {
                    sUpdates.status = 'Vendido';
                    sAction = 'Venda';
                } else if (stage === 'perdido') {
                    sUpdates.status = 'Disponível';
                    sAction = 'Perda';
                } else {
                    if(s.status !== 'Reservado') {
                        sUpdates.status = 'Reservado';
                        sAction = 'Reserva';
                    }
                }

                if(sAction) {
                    s.status = sUpdates.status;
                    sUpdates.history = APP.addLog(s, sAction, `Negócio: ${deal.client}`);
                    await supabase.from('stock').update(sUpdates).eq('id', s.id);
                }
            }
        }
        APP.renderAll();
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
                if(d.stage === 'perdido' && d.next_desc && d.next_desc.includes('PERDA')) { actionHtml = `<div class="card-action" style="color:#991b1b; font-weight:800; background:#fee2e2;">${d.next_desc}</div>`; }
                else if(d.next_date) {
                    const today = new Date().toISOString().split('T')[0];
                    const color = d.next_date < today ? '#ef4444' : '#2563eb';
                    const dateBr = d.next_date.split('-').reverse().join('/');
                    actionHtml = `<div class="card-action" style="color:${color}">📅 ${dateBr} - ${d.next_desc}</div>`;
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

        let deals = APP.data.deals.filter(d => d.stage !== 'ganho' && d.stage !== 'perdido' && d.next_date);
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

        deals.sort((a,b) => a.next_date.localeCompare(b.next_date));

        deals.forEach(d => {
            if (d.next_date < today) delayed.push(d);
            else if (d.next_date === today) todayList.push(d);
            else future.push(d);
        });

        const buildList = (title, list, className) => {
            if(list.length === 0) return '';
            let html = `<div class="agenda-group"><h4>${title} (${list.length})</h4>`;
            list.forEach(d => {
                const dateBr = d.next_date.split('-').reverse().join('/');
                html += `
                    <div class="agenda-item ${className}" onclick="APP.editDeal('${d.id}')" style="cursor:pointer">
                        <div class="agenda-date">${dateBr}</div>
                        <div class="agenda-info">
                            <div class="agenda-client">${d.client}</div>
                            <div class="agenda-desc">${d.next_desc || 'Sem descrição'}</div>
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
            if (d.original_cost !== undefined) {
                cost = d.original_cost;
            } else if (d.stock_id) {
                const stockItem = APP.data.stock.find(s => s.id === d.stock_id);
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
            // Diff date from DB (date_entry)
            const entryDate = s.date_entry ? new Date(s.date_entry).getTime() : Date.now();
            if(APP.daysDiff(entryDate) > 365) criticalValue += s.cost;
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
            const dealDateStr = d.close_date || (d.history && d.history[0] ? d.history[0].date : 0);
            const dealDate = new Date(dealDateStr).getTime();
            
            if (d.stage === 'ganho' && dealDate >= startDate && dealDate < endDate) {
                if (sourceFilter !== 'all' && d.source !== sourceFilter) return;
                if (APP.user.role !== 'gestor' && d.owner !== APP.user.name) return;
                if (APP.user.role === 'gestor' && sellerFilter !== 'all' && d.owner !== sellerFilter) return;

                totalVal += d.value;
                count++;
                let prodName = 'Consórcio/Serviço';
                let cost = 0;

                if(d.stock_id) {
                    const s = APP.data.stock.find(x => x.id === d.stock_id);
                    if(s) prodName = s.model;
                }
                
                if (d.original_cost !== undefined) {
                    cost = d.original_cost;
                } else if (d.stock_id) {
                    const stockItem = APP.data.stock.find(s => s.id === d.stock_id);
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
            container.innerHTML = list.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(h => {
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