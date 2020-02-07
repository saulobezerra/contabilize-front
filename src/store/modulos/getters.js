export function getProdutos (state) {
    return state.produtos
}

export function getUsuarioId (state) {
    return state.user ? state.user.id : 1
}

export function getUsuario(state) {
    return state.user
}

export function getReceitas(state) {
    return state.receitas
}

export function getDespesas(state) {
    return state.despesas
}

export function getTotalReceitas(state) {
    return state.totalReceitas
}

export function getTotalDespesas(state) {
    return state.totalDespesas
}