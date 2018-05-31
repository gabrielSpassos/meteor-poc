import angular from 'angular';
import angularMeteor from 'angular-meteor';
import listaTarefas from '../imports/components/listaTarefas/listaTarefas';
import '../imports/startup/accounts-config.js';

angular.module('tarefas-meteor', [
    angularMeteor,
    listaTarefas.name,
    'accounts.ui'
]);


