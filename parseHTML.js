const axios = require('axios');
const { parse } = require('node-html-parser');

// Step 1: Download HTML file
async function downloadHtml() {
    try {
        const response = await axios.get('https://www.ecfr.gov/api/renderer/v1/content/enhanced/2024-03-01/title-2');
        return response.data;
    } catch (error) {
        console.error('Error downloading HTML:', error);
        return null;
    }
}

// Step 2: Choose a Parsing Approach (DOM vs. SAX)
// Step 3: Extract Content
function extractContent(html) {
    const root = parse(html);
    const title = root.querySelector('div') ? root.querySelector('div').text.trim() : '';
    const sections = [];
    // Extract sections
    root.querySelectorAll('.section').forEach(sectionNode => {
        const sectionTitleElement = sectionNode.querySelector('h1');
        const sectionTitle = sectionTitleElement ? sectionTitleElement.text.trim() : '';
        const subsections = [];
        
        // Extract subsections
        sectionNode.querySelectorAll('.subsection').forEach(subsectionNode => {
            const subsectionTitleElement = subsectionNode.querySelector('h2');
            const subsectionTitle = subsectionTitleElement ? subsectionTitleElement.text.trim() : '';
            const paragraphs = [];

            // Extract paragraphs
            subsectionNode.querySelectorAll('.indent-1').forEach(paragraphNode => {
                const paragraph = {
                    content: paragraphNode.text.trim(),
                };
                paragraphs.push(paragraph);
            });
            console.log(paragraphs);
            const subsection = {
                title: subsectionTitle,
                paragraphs: paragraphs
            };
            subsections.push(subsection);
        });

        // Construct section object
        const section = {
            title: sectionTitle,
            subsections: subsections
        };
        sections.push(section);
    });
    // console.log(sections);
    // Construct JSON document
    const jsonDocument = {
        title: title,
        sections: sections
    };
    return jsonDocument;
}


// Step 4: Design Comprehensive Solution
// Step 5: Justify Parsing Approach
// Main function to orchestrate the process
async function main() {
    const html = await downloadHtml();
    if (html) {
        const jsonDocument = extractContent(html);
        console.log(JSON.stringify(jsonDocument, null, 2));
    }
}

// Start the process
main();
