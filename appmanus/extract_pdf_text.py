from PyPDF2 import PdfReader

def extract_text_from_pdf(pdf_path, output_path):
    reader = PdfReader(pdf_path)
    with open(output_path, 'w', encoding='utf-8') as f:
        for page in reader.pages:
            f.write(page.extract_text())

if __name__ == '__main__':
    pdf_file = '/home/ubuntu/upload/livreto_ver2.2.pdf'
    output_file = 'livreto_conteudo_completo.txt'
    extract_text_from_pdf(pdf_file, output_file)


