'use strict';
const fs = require('fs').promises;
let tasks = [];
const fileName = './tasks.json';

(async () => {
  // { name: タスクの名前, isDone: 完了しているかどうかの真偽値 }
  try {
      const data = await fs.readFile(fileName, 'utf8');
      tasks = JSON.parse(data);
      console.log(tasks); // ここに入んないといけない
  } catch(error) {
    console.log(error);
    if (error.code == 'ENOENT') {
      console.log('ファイルが存在しません')
    }
    if (error instanceof SyntaxError) {
      console.log('JSONが壊れています')
    }
  } finally {
    console.log('必ず実行します');
  }
})();

/**
 * タスクをファイルに保存する
 */
function saveTasks() {
  (async () => {
    await fs.writeFile(fileName, JSON.stringify(tasks), 'utf8');
  })();
}

/**
 * タスクを追加する
 * @param {string} taskName
 */
function add(taskName) {
  tasks.push({ name: taskName, isDone: false });
  saveTasks();
}

/**
 * タスクの一覧の配列を取得する
 * @return {array}
 */
function list() {
  return tasks
    .filter(isNotDone)
    .map(task => task.name);
}

/**
  * タスクと完了したかどうかが含まれるオブジェクトを受け取り、完了したかを返す
  * @param {object} task
  * @return {boolean} 完了したかどうか
  */
function isDone(task) {
  return task.isDone;
}

/**
 * タスクと完了したかどうかが含まれるオブジェクトを受け取り、完了していないかを返す
 * @param {object} task
 * @return {boolean} 完了していないかどうか
 */
function isNotDone(task) {
  return !isDone(task);
}

/**
 * タスクを完了状態にする
 * @param {string} taskName
 */
function done(taskName) {
  const indexFound = tasks.findIndex(task => task.name === taskName);
  if (indexFound !== -1) {
    tasks[indexFound].isDone = true;
  }
  saveTasks();
}

/**
 * 完了済みのタスクの一覧の配列を取得する
 * @return {array}
 */
function donelist() {
  return tasks
    .filter(isDone)
    .map(task => task.name);
}

/**
 * 項目を削除する
 * @param {string} taskName
 */
function del(taskName) {
  const indexFound = tasks.findIndex(task => task.name === taskName);
  if (indexFound !== -1) {
    tasks.splice(indexFound, 1);
  }
  saveTasks();
}

module.exports = {
  add,
  list,
  done,
  donelist,
  del
};