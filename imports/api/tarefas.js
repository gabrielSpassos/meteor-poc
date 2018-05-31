import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tarefas = new Mongo.Collection('tarefas');

if (Meteor.isServer) {
    // Este código só é executado no servidor
    // Publique somente tarefas públicas ou que pertençam ao usuário atual
    Meteor.publish('tarefas', function publicacaoTarefas() {
        return Tarefas.find({
            $or: [{
                privada: {
                    $ne: true
                }
            }, {
                owner: this.userId
            }, ],
        });
    });
}

Meteor.methods({
    'tarefas.insert' (descricao) {
        check(descricao, String);

        // Certifique-se de que o usuário esteja logado antes de inserir uma tarefa
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tarefas.insert({
            descricao,
            criadoEm: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'tarefas.remove' (taskId) {
        check(taskId, String);

        const tarefa = Tarefas.findOne(taskId);
        if (tarefa.privada && tarefa.owner !== Meteor.userId()) {
            // Se a tarefa for privada, certifique-se de que apenas o proprietário possa excluí-la
            throw new Meteor.Error('not-authorized');
        }

        Tarefas.remove(taskId);
    },
    'tarefas.setConcluida' (taskId, setConcluida) {
        check(taskId, String);
        check(setConcluida, Boolean);

        const tarefa = Tarefas.findOne(taskId);
        if (tarefa.privada && tarefa.owner !== Meteor.userId()) {
            // Se a tarefa for privada, certifique-se de que apenas o proprietário possa marcar a conclusão
            throw new Meteor.Error('not-authorized');
        }

        Tarefas.update(taskId, {
            $set: {
                concluida: setConcluida
            }
        });
    },
    'tarefas.setPrivada' (taskId, setParaPrivada) {
        check(taskId, String);
        check(setParaPrivada, Boolean);

        const tarefa = Tarefas.findOne(taskId);

        // Certifique-se de que apenas o proprietário da tarefa possa tornar uma tarefa privada
        if (tarefa.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tarefas.update(taskId, {
            $set: {
                privada: setParaPrivada
            }
        });
    },
});

