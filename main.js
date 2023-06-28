const search_term_el = document.querySelector('#searchTerm');
const search_result_el = document.querySelector('#searchResult');

search_term_el.focus();

search_term_el.addEventListener('input', function (event) {
    search(event.target.value);
});


const debounce = (fn, delay = 500) => {
    let timeout_id;
    return (...args) => {
        if (timeout_id) {
            clearTimeout(timeout_id);
        }
        timeout_id = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

const search = debounce(async (searchTerm) => {
    if (!searchTerm) {
        search_result_el.innerHTML = '';
        return;
    }

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
        const response = await fetch(url);
        const search_results = await response.json();
        const search_result_html = generate_search_result_html(search_results.query.search, searchTerm);
        search_result_el.innerHTML = search_result_html;
    } catch (error) {
        console.log(error);
    }
});

const strip_html = (html) => {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
};

const highlight = (str, keyword, className = "highlight") => {
    const hl = `<span class="${className}">${keyword}</span>`;
    return str.replace(new RegExp(keyword, 'gi'), hl);
};

const generate_search_result_html = (results, searchTerm) => {
    return results
        .map(result => {
            const title = highlight(strip_html(result.title), searchTerm);
            const snippet = highlight(strip_html(result.snippet), searchTerm);

            return `<article>
                <a href="https://en.wikipedia.org/?curid=${result.pageid}">
                    <h2>${title}</h2>
                </a>
                <div class="summary">${snippet}...</div>
            </article>`;
        })
        .join('');
}