#!/usr/bin/env node
import meow from 'meow'
import main from './main'
import { getCliArgs } from './lib/cli'
import availableSolutions from './data/available-solutions'

const cliFlags = {
  help: {
    type: 'boolean',
    alias: 'h',
  },
  all: {
    type: 'boolean',
    alias: 'a',
  },
  year: {
    type: 'string',
    alias: 'y',
  },
  day: {
    type: 'string',
    alias: 'y',
  },
  stopOnErrors: {
    type: 'boolean',
    alias: 's',
  },
}

const cli = meow(`
  Usage:
    solve
    solve <year>
    solve <year> <day>
    solve --year <year>
    solve --day <day>
    solve --all
    solve --stop-on-errors [...args]

  Options:
    [no args]
      Run all the tests for the most recent year.
    -h, --help
      Show this screen.
    -y, --year
      Run all solutions for the given year.
    -d, --day
      Run solution for the given year and day. Flag is ignored when year is not
      specified.
    -a, --all
      Run all solutions. All arguments, --year and --day flags are ignored.
    -s, --stop-on-errors
      Stop running solutions when an error is encountered.
`, {
  importMeta: import.meta,
  flags: cliFlags,
})

main({
  props: getCliArgs(cli),
  availableSolutions,
})
