// import Vue from 'vue'
import Axios from "axios";
import Global from '../../mixins/Global'
import {Loading} from 'quasar'


const axios = Axios.create({
    baseURL: 'https://contablz-e.herokuapp.com',
    timeout: 35000,
    // headers: {'X-Custom-Header': 'foobar'}
  });

  axios.interceptors.response.use(function (response) {
    Loading.hide()
    return response;
  }, function (error) {
    Loading.hide()
    return Promise.reject(error);
  });

  axios.interceptors.request.use(function (response) {
      console.log(response.url)
    if (response.url.indexOf("loadingApp") < 0) {
        Loading.show({
            spinnerSize: 50,
            spinnerColor: 'yellow'
        })
    } else {
        Loading.show({
            spinnerSize: 50,
            spinnerColor: 'yellow',
            customClass: 'classLoading'
        })
        response.url = response.url.replace('loadingApp', 'usuarios')
    }
    console.log(response.url)
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

 if(JSON.parse(localStorage.getItem('usuario'))){
     var usuarioGlobal = JSON.parse(localStorage.getItem('usuario'));
     var idUsuario = JSON.parse(localStorage.getItem('usuario')).id;
 }
  

export function someAction (/* context */) {
}

export function login(state, dadosLogin) {

    return new Promise((resolve, reject) => {
        let login = dadosLogin.login;
        let senha = dadosLogin.senha;
        axios.get('/usuarios/login/'+login+'/'+senha).then((resp) => {
            console.log(resp.data)
            state.commit('setUsuario', resp.data)
            idUsuario = state.getters['getUsuarioId']
            resolve(resp.data)
        })
        .catch(function (error) {
            let err = Global.methods.trataErros(error)
            state.commit('setMensagemErro', err);
            reject(err)
        })
    })
}

export function gravaUsuario(state, usuario) {
    console.log(usuario)
    return new Promise((resolve, reject) => {
        
        axios.post('/usuarios', usuario).then((resp) => {
            console.log("Cadastro realizado com sucesso", resp.data);
            resolve(true)
        })
        .catch( (error) => {
            let err = Global.methods.trataErros(error)
            state.commit('setMensagemErro', err);
            reject(err)
        })
    }) 
}

export function getUsuario() {
    console.log("request users");
    return new Promise((resolve, reject) => {
        axios.get('/usuarios/'+idUsuario).then((resp) => {
            if((resp.data.email == usuarioGlobal.email) && (resp.data.userName == usuarioGlobal.userName))
                resolve(true)
            else
                resolve(false)
       }).catch(e => {
            console.log(e);
            reject()
       });
    })
}

export function loadingApp() {
    console.log("request users");
    return new Promise((resolve, reject) => {
        axios.get('/loadingApp/'+idUsuario).then((resp) => {
            if((resp.data.email == usuarioGlobal.email) && (resp.data.userName == usuarioGlobal.userName))
                resolve(true)
            else
                resolve(false)
       }).catch(e => {
            console.log(e);
            reject()
       });
    })
}

export function getReceitas (state) {
    return new Promise((resolve) => {
        axios.get('/receitas/usuario/'+idUsuario)
        .then((resp) => {
            state.commit('setReceitas', resp.data)
            state.commit('totalReceitas', Global.methods.calculaTotal(resp.data) )
            state.commit('setTotalReceitasPendentes', Global.methods.getTotalPendentes(resp.data) )
            resolve(resp.data.length)
        })
        .catch(function (error) {
            console.log(error.response.data);
            state.commit('setMensagemErro', Global.methods.trataErros(error));
      });
    })
}

export function getReceitasPorMes (state, periodo) {
    return new Promise((resolve) => {
        axios.get('/receitas/usuario/'+idUsuario+ '/mes_ano/'+periodo.mes+'/'+periodo.ano)
        .then((resp) => {
            state.commit('setReceitas', resp.data)
            state.commit('totalReceitas', Global.methods.calculaTotal(resp.data) )
            state.commit('setTotalReceitasPendentes', Global.methods.getTotalPendentes(resp.data) )
            resolve(resp.data.length);
        })
        .catch(function (error) {
            console.log(error.response.data);
            state.commit('setMensagemErro', Global.methods.trataErros(error));
      });
    })
}

export function gravaReceita (state, receita) {
    receita['usuario'] = new Object();
    receita['usuario']['id'] = idUsuario;
    axios.post('/receitas', receita)
    .then(resp => {
        console.log('Receita cadastrada com sucesso' , resp)
        //state.dispatch('getReceitas')
        state.commit('addReceita', resp.data)
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function editarReceita (state, parametrosDaRequisicao) {
    console.log(parametrosDaRequisicao)
    axios.put('/receitas/' + parametrosDaRequisicao.idReceita, parametrosDaRequisicao.receita)
    .then(() => {
        state.dispatch('getReceitas')
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function editarDespesa (state, parametrosDaRequisicao) {
    axios.put('/despesas/' + parametrosDaRequisicao.idDespesa, parametrosDaRequisicao.despesa)
    .then(resp => {
        //state.commit('addProduto', resp.data)
        state.dispatch('getDespesas')
        console.log('Despesa alterada com sucesso', resp.data)
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })

}

export function gravaProduto(state, produto) {
    produto['usuario'] = new Object();
    produto['usuario']['id'] = idUsuario;

    axios.post('/produtos', produto)
    .then(resp => {
        state.commit('addProduto', resp.data)
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function gravaDespesa(state, despesa) {
    despesa['usuario'] = new Object();
    despesa['usuario']['id'] = idUsuario;
    console.log(despesa)
    axios.post('/despesas', despesa)
    .then(resp => {
        //state.dispatch('getDespesas')
        state.commit('addDespesa', resp.data)
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function getDespesas(state) {
    return new Promise((resolve) => {
        axios.get('/despesas/usuario/' + idUsuario)
        .then(resp => {
            state.commit('setDespesas', resp.data)
            state.commit('totalDespesas', Global.methods.calculaTotal(resp.data) )
            resolve(resp.data.length)
        })
        .catch(error => {
            console.log(error.response.data)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
        })
    })
} 

export function getDespesasPorMes(state, periodo) {
    return new Promise((resolve) => {
        axios.get('/despesas/usuario/' + idUsuario +'/mes_ano/' + periodo.mes + '/' + periodo.ano)
        .then(resp => {
            state.commit('setDespesas', resp.data)
            state.commit('totalDespesas', Global.methods.calculaTotal(resp.data) )
            resolve(resp.data.length)
        })
        .catch(error => {
            console.log(error.response.data)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
        })
    })
} 

export function deletarDespesa(state, idDespesa) {

    return new Promise((resolve, reject) => {  
        axios.delete('/despesas/'+idDespesa)
        .then( () => {
            resolve()
        })
        .catch(error => {
            reject(error.response.data)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
        })
    }) 
}

export function deletarReceita(state, idReceita) {

    return new Promise((resolve, reject) => {  
        axios.delete('/receitas/'+idReceita)
        .then( () => {
            resolve()
        })
        .catch(error => {
            reject(error.response.data)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
        })
    }) 
}

export function deletarProduto(state, idProduto) {

    return new Promise((resolve, reject) => {  
        axios.delete('/produtos/'+idProduto)
        .then( () => {
            resolve()
        })
        .catch(error => {
            reject(error.response.data)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
        })
    }) 
} 

export function getTiposDespesas (state) {
    axios.get('/tiposDespesa')
    .then(resp => {
        console.log(resp)
        state.commit('setTiposDespesa', resp.data)

    })
    .catch(error => {
        console.log(error.response.data);
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function editaProduto(state, parametrosDaRequisicao) {
    axios.put('/produtos/'+parametrosDaRequisicao.idProd, parametrosDaRequisicao.produto)
    .then((resp) => {
        state.dispatch('getProdutos')
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}

export function getProdutos(state) {
    return new Promise((resolve, reject) => {
        axios.get('/produtos/usuario/'+ idUsuario)
        .then((resp) => {
            state.commit('setProdutos', resp.data)
            resolve(resp.data.length);
        })
        .catch(error => {
            console.log(error)
            state.commit('setMensagemErro', Global.methods.trataErros(error));
            reject();
        })
    } )
    
}

export function getLucrosDefault(state) {
    //idUsuario =  Global.methods.getIdUsuario()
    //idUsuario =  state.getters.getUsuario.id
    axios.get('/lucros/usuario/' + idUsuario + '/default')
    .then(resp => {
        state.commit('setLucrosDefault', resp.data)
    })
    .catch(error => {
        console.log(error.response.data)
        state.commit('setMensagemErro', Global.methods.trataErros(error));
    })
}
