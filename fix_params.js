const fs = require('fs');
const glob = require('glob'); // use standard fs traversal

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = dir + '/' + file;
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('route.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Match pattern: { params }: { params: { id: string } }
            // or { params }: { params: { fileId: string } }
            // and replace with Promise type
            content = content.replace(
                /\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*([a-zA-Z0-9_]+)\s*:\s*string\s*\}\s*\}/g,
                (match, p1) => {
                    modified = true;
                    return `{ params }: { params: Promise<{ ${p1}: string }> }`;
                }
            );

            // Now, we need to add await params inside the function.
            // A simple regex might be tricky if params.id is used directly.
            // Let's replace `const id = params.id;` or `params.id` with `const { id } = await params;` if possible.
            // But an easier way in JS:
            // Find `params.id` or `params.fileId` uses.
            if (modified) {
                // If it's Next 15, we must `await params`. 
                // Let's replace the first line inside the try or function block with:
                // const resolvedParams = await params;
                // and then replace `params.` with `(await params).`
                content = content.replace(/params\.([a-zA-Z0-9_]+)/g, "(await params).$1");
                
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    });
}

traverseDir('./src/app/api');
