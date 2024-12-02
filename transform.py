import pypandoc
import re
import datetime

def markdown_to_html_with_template(md_file, template_file, output_html_file):
  # Step 1: Read the Markdown content
    with open(md_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()

    # Step 2: Preprocess Markdown for WikiLinks
    markdown_content = process_wikipedia_links(markdown_content)

    # Step 3: Convert Markdown to HTML using Pandoc
    html_content = pypandoc.convert_text(markdown_content, 'html', format='markdown')
    html_content = process_side_notes(html_content)

    # Step 2: Extract content for Tags, Abstract, and other sections
    tags_section = ""
    abstract_section = ""
    content_section = ""
    current_section = None
    main_title = ""
    side_notes= ""
    articleImage = ""
    for line in html_content.splitlines():
        line = line.strip()
        print(line)

        # Detect section headings
        if line.startswith("<h1") and line.endswith("</h1>"):
            main_title = line
            continue
        
        elif line.startswith('<h2 id="tags">Tags</h2>'):
            current_section = "tags"
            continue
        elif line.startswith('<h2 id="abstract">Abstract</h2>'):
            current_section = "abstract"
            continue
        elif line.startswith("<h2"):
            current_section = None
        elif line.startswith('<div id="side-note') and line.endswith("</div>"):
            side_notes+=line
            continue
        elif line.startswith('<p><img class="articleImage"'):
            articleImage = line[3:-4]
            continue

        # Process content based on the current section
        if current_section == "tags":
            # Look for list items in the Tags section
            if line.startswith("<li>") and line.endswith("</li>"):
                tag_content = line[4:-5]  # Remove <li> and </li>
                tags_section += f'<div class="tag-box">{tag_content}</div>'
        elif current_section == "abstract":
            abstract_section += line + "\n"
        else:
            # Wrap other content in divs
            if line.startswith("<p>") and line.endswith("</p>"):
                content_section += line + '\n'
            else:
                content_section += line + "\n"

    # Wrap the abstract section
    # if abstract_section:
    #     abstract_section = f'<div class="abstract">{abstract_section}</div>'

    # Step 3: Read the HTML template
    with open(template_file, 'r', encoding='utf-8') as f:
        template = f.read()
    
    current_date = datetime.datetime.now().strftime("%B %d, %Y")

    # Step 4: Replace placeholders with dynamic content
    final_html = template.replace('{{TITLE}}',main_title)
    final_html = final_html.replace('{{DATE}}',current_date)
    final_html = final_html.replace('{{TAGS}}', tags_section)
    final_html = final_html.replace('{{ABSTRACT}}', abstract_section)
    final_html = final_html.replace('{{CONTENT}}', content_section)
    final_html = final_html.replace('{{SIDE-NOTES}}', side_notes)
    final_html = final_html.replace('{{IMAGE}}', articleImage)


    # Step 5: Write the final HTML to the output file
    with open(output_html_file, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print(f"HTML output saved to {output_html_file}")


def process_wikilinks(content):
    """
    Replace all instances of [[WL ...]] with custom HTML structure.
    """

    # Regex pattern for matching [[WL ...]]
    wikilink_pattern = r"\[\[WL\s+(.*?)\]\]"

    # Replacement function
    def replace_with_ref(match):
        note_text = match.group(1)  # Extract the text inside [[WL ...]]
        # Return the HTML link with the text
        reference = f'<a href="javascript:void(0);" class="wiki-link" data-term="{note_text}">{note_text}</a>'
        return reference

    # Use re.sub with the replacement function
    return re.sub(wikilink_pattern, replace_with_ref, content)


def process_wikipedia_links(content):
    """
    Identify and process Markdown links that point to Wikipedia.
    """
    print(content)
    # Regex pattern to match Markdown links with en.wikipedia.org in the URL
    wikipedia_link_pattern = r'\[([^\]]+)\]\(https://en\.wikipedia\.org/wiki/([^\)]+)\)'

    def replace_with_custom_html(match):

        link_text = match.group(1)  # The visible text
        wiki_topic = match.group(2)  # The topic in the URL
        # Create a custom HTML link with the wiki-link class
        return f'<a href="javascript:void(0);" class="wiki-link" data-term="{wiki_topic}">{link_text}</a>'

    # Replace all matching links in the content
    return re.sub(wikipedia_link_pattern, replace_with_custom_html, content)

def process_side_notes(content):
    """
    Replace all instances of [[SIDE-NOTE: ...]] with custom HTML structure.
    Add an incrementing data-ref attribute to each side note.
    """
    side_note_pattern = r"\[\[SIDE-NOTE:\s*(.*?)\]\]"
    ref_counter = 0  # Initialize counter

    def replace_with_ref(match):
        nonlocal ref_counter
        ref_counter += 1
        note_text = match.group(1)  # Extract the side note text
        sideNote = f'<div id="side-note-{ref_counter}" class="side-note"> {note_text}</div>'+ '\n'
        reference = f'<p class="reference" data-ref="{ref_counter}"</p>' + '\n'
        return  reference + sideNote

    return re.sub(side_note_pattern, replace_with_ref, content)


# Example usage
markdown_file = "pages/CV.md"          # Path to your Markdown file
template_file = "templates/page.html"   # Path to your HTML template
output_html_file = "output.html"  # Desired output HTML file path

markdown_to_html_with_template(markdown_file, template_file, output_html_file)