const express = require ('express');
const fs = require('fs');


const usuarios = express.Router() //usuários será uma rota.

usuarios.route('/')
.get((req, res) => {
    const { nome, media } = req.query;
    console.log(req.query);

    // retorna o banco de dados
    const db = lerBancoDados();

    if (!nome && !media) {
        res.status(200).json(db);
    }  else if(nome) {
        const dbfiltrado = db.filter(aluno => aluno.nome.toLowerCase().includes(nome.toLowerCase()));
        if(dbfiltrado.length === 0){
            res.status(404).json({ mensagem: "aluno não encontrado" });
            return;
        } else{
            res.status(200).json(dbfiltrado);
        }

    } else if (media) {
        const dbfiltrado = db.filter(aluno => Number(aluno.media) >= Number(media));
        if(dbfiltrado.length === 0){
            res.status(404).json({ mensagem: "não encontrado com o parâmetro informado." });
            return;
        } else{
            res.status(200).json(dbfiltrado);
        }
    }

})

.post((req, res)=>{
    
    const {matricula, nome, media} = req.body;

    if(!matricula || !nome || !media){
        res.status(400).json({ mensagem: "Dados inválidos" });
        return;
    }

    // define um novo aluno com base nos dados enviados na requisição
    const novoAluno = {
        matricula,
        nome,
        media
    };

    // retorna o banco de dados
    const db = lerBancoDados();

    // verifica se o aluno informado existe no banco de dados
    const alunoEcontrado = db.find(aluno => aluno.matricula === matricula);

    // caso o aluno exista ele retorna erro, e encerra a requisição.
    if(alunoEcontrado){
        res.status(400).json({mensagem: "aluno já está cadastrado"});
        return;
    }

    // adiciona o novo aluno no array retornado do banco de dados
    db.push(novoAluno);

    // grava o array modificado no banco de dados fake
    gravarBancoDados(db);

    // retorna status 201 com mensagem de sucesso.
    res.status(201).json({ mensagem: "aluno criado com sucesso!" });

    
})

.put((req, res)=>{
    const {matricula, nome , media} = req.body;

    if(!matricula || !nome || !media){
        res.status(400).json({mensagem: "Dados obrigatórios não informados :|"})
        return;
    }

    const db = lerBancoDados();

    const alunoEcontrado = db.find(aluno => aluno.matricula === matricula);

    if(!alunoEcontrado) {
        res.status(404).json({mensagem:"Este aluno não foi encontrado :("})
        return;
    }

    const dbModificado = db.filter(aluno => aluno.matricula !== matricula);

    const alunoModificado = {
        matricula,
        nome,
        media
    }
 
    dbModificado.push(alunoModificado);
    gravarBancoDados(dbModificado);
    res.status(200).json({mensagem: "Usuário Atualizado com sucesso :)"})
})

.delete((req, res)=> {
    const { matricula } = req.body;

        // verifica se o campo matricula foi informado na requisição
        if (!matricula) { // se não foi informado retorna um erro e encerra a requisição.
            res.status(400).json({ mensagem: "Dados inválidos" });
            return;
        }

        // retorna o banco de dados
        const db = lerBancoDados();

        // encontra a matricula do aluno
        const alunoEcontrado = db.find(aluno => aluno.matricula === matricula);

        // verifica se há resposta na pesquisa anterior
        if (!alunoEcontrado) { // se não existir envia mensagem de erro e encerra a requisição
            res.status(404).json({ mensagem: "Aluno não encontrado." });
            return;
        }

        /* 
        filtra o array de usuarios que retornou do banco de dados 
        vai retornar todos os alunos, exceto o aluno que queremos excluir
        */
        const dbfiltrado = db.filter(usuarios => usuarios.matricula !== matricula);

        // grava a informação no arquivo de alunos, ou seja, no banco fake
        gravarBancoDados(dbfiltrado);

        // retorna status 200 e mensagem de confirmação de exclusão.
        res.status(200).json({ mensagem: "deletado com sucesso!" });
});

function lerBancoDados() {
    const data = fs.readFileSync('./db/db.json');
    const db = JSON.parse(data.toString());
    return db;
}

function gravarBancoDados(usuariosDB){
fs.writeFileSync('./db/db.json', JSON.stringify(usuariosDB));
}

module.exports = usuarios;