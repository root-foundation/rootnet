# Use XeLaTeX so system fonts via fontspec work (e.g., SF Pro).
$pdf_mode = 1;
$pdflatex = 'xelatex -interaction=nonstopmode -file-line-error -synctex=1 %O %S';


