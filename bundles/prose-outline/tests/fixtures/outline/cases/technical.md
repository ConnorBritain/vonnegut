# outline-store reference

Command-line reference for the outline store. All paths are relative to the skill directory.

## locate

Prints the projects directory and the registry state. Takes no arguments. Exit code is 0 in every registry state; the state is in the output.

## show

Prints the current outline for a project. Requires `--project`. Exits 1 if no outline exists for that project.

## save

Writes a proposal as the next revision. Requires `--proposal`, `--project` and `--expected-revision`. Without `--approved` it prints what it would write and exits 0 without writing.

## undo

Restores the previous revision as a new revision. Requires `--project` and `--expected-revision`. Refused at revision 1.

## list

Prints every revision for a project, oldest first, with its parent digest.
