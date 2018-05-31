/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Tarefas } from './tarefas.js';

if (Meteor.isServer) {
    describe('Tarefas', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;

            beforeEach(() => {
                Tarefas.remove({});
                taskId = Tarefas.insert({
                    descricao: 'Tarefa de Teste',
                    criadoEm: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });

            it('pode excluir tarefas que é proprietário', () => {
                // Encontre a implementação interna do método de tarefa para que possamos
                // testar de forma isolada
                const removerTarefa = Meteor.server.method_handlers['tarefas.remover'];

                // Configurar uma invocação de método falsa que se parece com o que o método espera
                const invocation = {
                    userId
                };

                // Executa o método com `this` definido para a invocação falsa
                removerTarefa.apply(invocation, [taskId]);

                // Verifica se o método faz o que esperávamos
                assert.equal(Tarefas.find().count(), 0);
            });
        });
    });
}
