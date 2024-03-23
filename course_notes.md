when 'bin' key is defined in package.json, you can create a symlink for use during development. In bin add a key for the name of your program. The goal is to invoke your program like a native command - or like every other cli. (ie, git, gh, aws, npm, etc). In our case, the name is "note" so we add a "note" key.

The value for the key will be the entry point of the cli.

```json
{
  // package.json
  ...
  "bin": {
      "note": "./index.js"
    },
}
```

We need to tell the machine how to interpret the file specified as the entry point. So in that file we need a shebang that tells the machine to use node to run the file.

index.js - or whatever the entrypoint is
```javascript
#!/usr/bin/env node
// ... js program here
```

```bash
npm link 
```


Keep files light and as small as possible
separate logically by responsibility