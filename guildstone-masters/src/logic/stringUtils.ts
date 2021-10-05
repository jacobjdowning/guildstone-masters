export function slugify(name:string){
    const replacements:Array<[RegExp, string]> = [
        [/ /g, '-'],
        [/'/g, '']
    ]
    const withReplacements = replacements.reduce((name, replacement) => name.replace(...replacement), name)
    return withReplacements.toLowerCase()
}