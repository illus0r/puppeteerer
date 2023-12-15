To install globally run
```
git clone https://github.com/illus0r/puppeteerer/
cd puppeteerer
npm install -g
```

To learn about parameters, run
```
puppeteerer --help
```

Here's what it prints:
```
Usage: puppeteerrer <url> [width [height [cols [rows]]]] [--maxsize] [--timeout]

Options:
      --version  Show version number                                   [boolean]
      --maxsize  Maximum collage size                   [number] [default: 4000]
      --timeout  Page wait timeout                       [number] [default: 100]
  -h, --help     Show help                                             [boolean]

Examples:
  puppeteerrer http://127.0.0.1:8080        Render a collage with default
                                            parameters
  puppeteerrer http://127.0.0.1:8080 800    Render a collage with custom
  600 5 4 --maxsize=5000 --timeout=200      parameters
```
