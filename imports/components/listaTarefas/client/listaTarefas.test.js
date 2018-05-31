/* eslint-env mocha */

import 'angular-mocks';
import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

import listaTarefas from '../listaTarefas';

describe('listaTarefas', function() {
    var element;

    beforeEach(function() {
        var $compile;
        var $rootScope;

        window.module(listaTarefas.nome);

        inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        element = $compile('<lista-tarefas></lista-tarefas>')($rootScope.$new(true));
        $rootScope.$digest();
    });

    describe('component', function() {
        it('deve estar mostrando tarefas incompletas', function() {
            assert.include(element[0].querySelector('h1').innerHTML, '0');
        });
    });
});

describe('controller', function() {
    describe('adicionarTarefa', function() {
        var controller;
        var novaTarefa = 'Seja mais perfeito';

        beforeEach(() => {
            sinon.stub(Meteor, 'call');
            controller = element.controller('listaTarefas');
            controller.novaTarefa = 'Seja perfeito';
            controller.adicionarTarefa(novaTarefa);
        });

        afterEach(() => {
            Meteor.call.restore();
        });

        it('deveria chamar o método tarefas.insert', function() {
            sinon.assert.calledOnce(Meteor.call);
            sinon.assert.calledWith(Meteor.call, 'tarefas.insert', novaTarefa);
        });

        it('deveria resetar a novaTarefa', function() {
            assert.equal(controller.novaTarefa, '');
        });
    });
});

