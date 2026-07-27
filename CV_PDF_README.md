# CV PDF 

## 🚀 快速使用

```bash
# 生成 PDF
./scripts/build_cv_pdf.sh

# 或使用 npm
npm run build:cv
```

生成的PDF将保存在 `data/CV_Ziru_Wei.pdf`，并可通过网站下载。

## 🔤 字体切换

默认使用 **LaTeX 自带衬线字体** 渲染。可以通过参数或环境变量切换：

```bash
# 使用默认 LaTeX 字体
./scripts/build_cv_pdf.sh --font default

# 或者
CV_FONT=default npm run build:cv

# 切换到 Roboto
./scripts/build_cv_pdf.sh --font roboto
```

## 📁 文件结构

```
scripts/
├── build_cv_pdf.sh                    # 主构建脚本
├── preprocess_cv.sh                   # Markdown预处理
└── pandoc_cv_template_simple.tex      # LaTeX模板

data/
├── CV_Ziru_Wei.pdf                            # 生成的PDF
└── cv_template.tex                   # 原始模板（参考）

cv.html                               # 网页版CV（含下载按钮）
cv.md                                 # Markdown源文件
```

## 🔧 系统要求

- **pandoc** (`brew install pandoc`)
- **XeLaTeX / LuaLaTeX** (`brew install --cask mactex`)
