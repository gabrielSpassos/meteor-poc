import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tarefas } from '../../api/tarefas.js';
import { Meteor } from 'meteor/meteor';

import template from './listaTarefas.html';

class ListaTarefasCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('tarefas');

        this.esconderCompletada = false;

        this.helpers({
            tarefas(){
                const selecao = {};

                // Se ocultar concluídas estiver marcado, filtre as tarefas
                if (this.getReactively('esconderConcluida')) {
                    selecao.concluida = {
                        $ne: true
                    };
                }

                // Mostrar as tarefas mais recentes no topo
                return Tarefas.find(selecao, {
                    sort: {
                        criadoEm: -1
                    }
                });
            },
            contaIncompletas() {
                return Tarefas.find({
                    concluida: {
                        $ne: true
                    }
                }).count();
            },
            usuarioLogado() {
                return Meteor.user();
            }
        })
    }

    adicionarTarefa(novaTarefa) {
        // Inserir uma tarefa na coleção
        Meteor.call('tarefas.insert', novaTarefa);

        // Limpar formulário
        this.novaTarefa = '';

    }

    setConcluida(tarefa) {
        // Defina a propriedade marcada para o oposto de seu valor atual
        Meteor.call('tarefas.setConcluida', tarefa._id, !tarefa.concluida);
    }

    removerTarefa(tarefa) {
        Meteor.call('tarefas.remove', tarefa._id);
    }

    setPrivada(tarefa) {
        Meteor.call('tarefas.setPrivada', tarefa._id, !tarefa.privada);
    }


}

export default angular.module('listaTarefas', [
    angularMeteor
])
    .component('listaTarefas', {
        templateUrl: 'imports/components/listaTarefas/listaTarefas.html',
        controller: ['$scope', ListaTarefasCtrl]
    });


