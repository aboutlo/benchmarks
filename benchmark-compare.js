#!/usr/bin/env node
const { existsSync } = require('fs')
const inquirer = require('inquirer')
const { compare } = require('./lib/autocannon')
const path = require('path')
const chalk = require('chalk')

let choices = [
  'bare',
  'connect',
  'connect-router',
  'express-route-prefix',
  'express-with-middlewares',
  'express',
  'hapi',
  'koa-router',
  'koa',
  'restify',
  'take-five',
  'total.js',
  'fastify',
  'fastify-big-json',
  'micro',
  'micro-router'
]

const resultsDirectory = path.join(process.cwd(), 'results')
choices = choices.filter(choice => existsSync(path.join(resultsDirectory, `${choice}.json`)))

if (choices.length === 0) {
  console.log(chalk.red(`Run benchmark first to gather results to compare`))
} else {
  inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'What\'s your first pick?',
    choices: choices
  }]).then(function (firstChoice) {
    choices = choices.filter(choice => choice !== firstChoice.choice)
    inquirer.prompt([{
      type: 'list',
      name: 'choice',
      message: 'What\'s your second one?',
      choices: choices
    }]).then(function (secondChoice) {
      let [a, b] = [firstChoice.choice, secondChoice.choice]
      let result = compare(a, b)
      if (result === true) {
        console.log(chalk.green.bold(`${a} and ${b} both are fast!`))
      } else {
        console.log(chalk.blue(`Both are awesome but`), chalk.bold.green(result.fastest), chalk.blue(`is`), chalk.red(result.diff), chalk.blue(`faster than`), chalk.bold.yellow(result.slowest))
        console.log(chalk.bold.green(result.fastest), chalk.blue(`request average is`), chalk.green(result.fastestAvarege))
        console.log(chalk.bold.yellow(result.slowest), chalk.blue(`request average is`), chalk.yellow(result.slowestAvarege))
      }
    })
  })
}
