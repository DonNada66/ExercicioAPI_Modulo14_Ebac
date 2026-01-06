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
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": usuario,
        "email": email,
        "password": '123456',
        "administrador": 'true'
      }
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal("Cadastro realizado com sucesso")
    })
  });

  it.only('Deve validar um usuário com email inválido', () => {
    //TODO: 
    var numeroCadastro = Math.floor(Math.random() * 200000)
    let usuario = `Usuario teste ${numeroCadastro}`

    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": usuario,
        "email": 'fulano@qa.com',
        "password": '123456',
        "administrador": 'true'
      },
      failOnStatusCode: false

    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal("Este email já está sendo usado")
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO: 
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    //TODO: 
  });


});
