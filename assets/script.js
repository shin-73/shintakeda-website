window.addEventListener('load', () => {

    if (window.innerWidth <= 768) {
        const img = document.getElementById('keyvisualImage');
        const wrapper = document.getElementById('scrollWrapper');
        const container = document.querySelector('.keyvisual-container');
        let lastWidth = window.innerWidth;

        function lockHeights() {
            const vh = window.innerHeight * 0.01;
            container.style.height = (vh * 80) + 'px';
            img.style.height = (vh * 75) + 'px';
            img.style.marginTop = (vh * 5) + 'px';
        }

        function adjustCropAndScroll() {
            lockHeights();

            img.style.marginLeft = '0px';
            img.style.marginRight = '0px';
            void img.offsetWidth;

            const originalW = img.clientWidth;
            const innerW = window.innerWidth;

            let rightCrop = (originalW * 0.25) - (innerW / 2);
            let leftCrop = rightCrop - (innerW * 0.10);

            if (rightCrop > 0) {
                img.style.marginRight = `-${rightCrop}px`;
            }
            if (leftCrop > 0) {
                img.style.marginLeft = `-${leftCrop}px`;
            } else {
                img.style.marginLeft = '0px';
            }

            wrapper.scrollLeft = wrapper.scrollWidth;
        }

        if (img.complete && img.clientWidth > 0) {
            adjustCropAndScroll();
        } else {
            img.addEventListener('load', adjustCropAndScroll);
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth !== lastWidth && window.innerWidth <= 768) {
                    adjustCropAndScroll();
                    lastWidth = window.innerWidth;
                }
            }, 100);
        });
    }

    // Fetch Insights RSS Feed
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://note.com/shintakedallc/rss')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok' && data.items) {
                const insightsList = document.getElementById('insightsList');
                const items = data.items.slice(0, 3);
                items.forEach(item => {
                    const dateObj = new Date(item.pubDate.replace(/-/g, '/')); // Safari対応
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const dateStr = `${year}.${month}.${day}`;

                    const li = document.createElement('li');
                    li.className = 'insights-item';

                    const a = document.createElement('a');
                    a.className = 'insights-link';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';

                    try {
                        const url = new URL(item.link);
                        if (url.protocol === 'http:' || url.protocol === 'https:') {
                            a.href = url.href;
                        } else {
                            a.href = 'https://note.com/shintakedallc';
                        }
                    } catch {
                        a.href = 'https://note.com/shintakedallc';
                    }

                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'insights-date';
                    dateSpan.textContent = dateStr;

                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'insights-title';
                    titleSpan.textContent = item.title || 'タイトルなし';

                    a.appendChild(dateSpan);
                    a.appendChild(titleSpan);
                    li.appendChild(a);
                    insightsList.appendChild(li);
                });
            }
        })
        .catch(err => {
            console.error('Error fetching Insights RSS:', err);

            const insightsList = document.getElementById('insightsList');
            insightsList.replaceChildren();

            const li = document.createElement('li');
            li.className = 'insights-item';

            const a = document.createElement('a');
            a.className = 'insights-link';
            a.href = 'https://note.com/shintakedallc';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = '記事の取得に失敗しました。note一覧をご覧ください。';

            li.appendChild(a);
            insightsList.appendChild(li);
        });
});
