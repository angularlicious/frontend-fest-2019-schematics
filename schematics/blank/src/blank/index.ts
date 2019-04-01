import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function blank(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info('Hello Schematics')
    return tree;
  };
}
