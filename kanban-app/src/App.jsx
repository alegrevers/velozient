import React, { useState } from 'react';

// Componente principal que renderiza o quadro Kanban
export default function App() {
  // Constantes para os estágios do quadro Kanban
  const STAGES = ['Backlog', 'To Do', 'Ongoing', 'Done'];
  const STAGE_IDS = [0, 1, 2, 3];

  // Estado para armazenar a lista de todas as tarefas
  // Cada tarefa é um objeto com 'name' e 'stage'
  const [tasks, setTasks] = useState([]);

  // Estado para armazenar o valor do campo de entrada da nova tarefa
  const [newTaskName, setNewTaskName] = useState('');

  // Função para gerar o data-test-id necessário para uma tarefa
  const formatTaskNameForTestId = (name) => {
    return name.replace(/\s+/g, '-');
  };

  // --- Manipuladores de Eventos ---

  // Lida com a criação de uma nova tarefa
  const handleCreateTask = () => {
    // Não faz nada se a entrada estiver vazia ou contiver apenas espaços em branco
    if (newTaskName.trim() === '') {
      return;
    }
    // Verifica se já existe uma tarefa com o mesmo nome para garantir a exclusividade
    if (tasks.some(task => task.name === newTaskName.trim())) {
        // Em um aplicativo real, você pode exibir uma mensagem de erro aqui.
        console.error("Uma tarefa com este nome já existe.");
        return;
    }
    // Adiciona a nova tarefa ao início do estágio 'Backlog' (estágio 0)
    setTasks(prevTasks => [...prevTasks, { name: newTaskName.trim(), stage: 0 }]);
    // Limpa o campo de entrada após a criação
    setNewTaskName('');
  };

  // Lida com a movimentação de uma tarefa entre os estágios (para frente ou para trás)
  const handleMoveTask = (taskNameToMove, direction) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.name === taskNameToMove) {
          // Cria um novo objeto de tarefa com o estágio atualizado
          return { ...task, stage: task.stage + direction };
        }
        return task;
      })
    );
  };

  // Lida com a exclusão de uma tarefa
  const handleDeleteTask = (taskNameToDelete) => {
    setTasks(prevTasks => prevTasks.filter(task => task.name !== taskNameToDelete));
  };


  // --- Renderização ---

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Seção do Cabeçalho */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">Kanban Board</h1>
        </header>

        {/* Seção de Criação de Tarefas */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nome da nova tarefa"
            data-test-id="create-task-input"
            className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleCreateTask}
            data-test-id="create-task-button"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Create Task
          </button>
        </div>

        {/* Seção do Quadro com Estágios */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGE_IDS.map(stageId => (
            <div key={stageId} className="bg-gray-800 rounded-lg p-4 shadow-xl flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4 text-cyan-300 border-b-2 border-gray-700 pb-2">{STAGES[stageId]}</h2>
              <ul data-test-id={`stage-${stageId}`} className="space-y-4 flex-grow">
                {tasks
                  .filter(task => task.stage === stageId)
                  .map(task => {
                    const testIdName = formatTaskNameForTestId(task.name);
                    return (
                      <li key={task.name} className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center transition-transform hover:scale-105">
                        <span data-test-id={`${testIdName}-name`} className="break-words w-2/3">
                          {task.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          {/* Botão Voltar */}
                          <button
                            onClick={() => handleMoveTask(task.name, -1)}
                            disabled={task.stage === 0}
                            data-test-id={`${testIdName}-back`}
                            className="p-2 rounded-full transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-gray-600"
                            aria-label="Mover tarefa para trás"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {/* Botão Avançar */}
                          <button
                            onClick={() => handleMoveTask(task.name, 1)}
                            disabled={task.stage === STAGES.length - 1}
                            data-test-id={`${testIdName}-forward`}
                            className="p-2 rounded-full transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-gray-600"
                            aria-label="Mover tarefa para frente"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                           {/* Botão Excluir */}
                          <button
                            onClick={() => handleDeleteTask(task.name)}
                            data-test-id={`${testIdName}-delete`}
                            className="p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
                            aria-label="Excluir tarefa"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                             </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
