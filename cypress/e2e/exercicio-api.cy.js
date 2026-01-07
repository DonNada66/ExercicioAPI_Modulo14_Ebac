/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(20)
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    var numeroCadastro = Math.floor(Math.random() * 200000)
    let usuario = `Usuario teste ${numeroCadastro}`
    let email = `usuarioteste${numeroCadastro}@ebac.com.br`
    cy.cadastrarUsuario(usuario, email, '123456', 'true').then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal("Cadastro realizado com sucesso")
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    var numeroCadastro = Math.floor(Math.random() * 200000)
    let usuario = `Usuario teste ${numeroCadastro}`

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": usuario,
        "email": 'fulanoqa.com',
        "password": '123456',
        "administrador": 'true'
      },
      failOnStatusCode: false

    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.email).to.equal("email deve ser um email válido")
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    var numeroCadastro = Math.floor(Math.random() * 200000)
    let usuario = `Usuário Editado ${numeroCadastro}`
    let email = `usuarioeditado${numeroCadastro}@ebac.com.br`


    cy.cadastrarUsuario(usuario, email, '123456', 'true').then((response) => {
      let id = response.body._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body:
        {
          "nome": `Usuário Editado ${Math.floor(Math.random() * 200000)}`,
          "email": `usuarioteste${Math.floor(Math.random() * 200000)}@ebac.com.br`,
          "password": "teste",
          "administrador": "true"
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    var numeroCadastro = Math.floor(Math.random() * 200000)
    let usuario = `Usuário Exclusão ${numeroCadastro}`
    let email = `usuarioeexclusao${numeroCadastro}@ebac.com.br`

    cy.cadastrarUsuario(usuario, email, '123456', 'true').then((response) => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).then(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  });
});


