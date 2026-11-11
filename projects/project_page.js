import { projects } from './project_info.js';
import { VisitTracker } from './visit_tracker.js';

// 从 URL 获取当前项目名称
const projectName = window.location.pathname.split('/')[2];  // projects/name/name.html -> name

// 找到对应的项目
const project = projects.find(p => p.name === projectName);

if (project) {
    // 设置页面标题
    document.title = `${project.title} - Ziru Wei`;

    // 填充项目标题和副标题
    const heading = project.getPageHeading();
    document.querySelector('.project-title').textContent = heading.title;
    const subtitleElement = document.querySelector('.project-subtitle');
    subtitleElement.textContent = heading.subtitle;
    subtitleElement.hidden = !heading.subtitle;
    
    // 创建并填充元数据
    const metaSection = document.querySelector('.project-meta');
       // 添加链接
       if (project.youtubeLink || project.pdfLink || project.githubLink || project.otherLink2 || project.doi || project.publication) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'meta-item links-container';
        const linksWrapper = document.createElement('div');
        linksWrapper.className = 'links-wrapper';

        // 链接配置映射
        const linkConfig = {
            'doi': { label: 'DOI↗', value: project.doi },
            'pdfLink': { label: 'PDF↗', value: project.pdfLink },
            'youtubeLink': {
                label: 'Video↗',
                value: project.youtubeLink?.replace(/https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]+).*/, 'https://www.youtube.com/watch?v=$1')
            },
            'githubLink': { label: 'GitHub↗', value: project.githubLink },
            'otherLink2': { label: 'Project Page↗', value: project.otherLink2 },
        };

        // 根据 linkOrder 生成链接
        const links = [];
        project.linkOrder.forEach(linkKey => {
            const config = linkConfig[linkKey];
            if (config && config.value) {
                links.push(createMetaLink(config.label, config.value));
            }
        });

        links.forEach(link => linksWrapper.appendChild(link));
        linksContainer.appendChild(linksWrapper);
        if (project.publication) {
            appendBibtexControls(project, linksWrapper, linksContainer);
        }
        metaSection.appendChild(linksContainer);
    }
    if (project.author) {
        metaSection.appendChild(createMetaItem('Authors', project.author));
    }
    if (project.venue) {
        metaSection.appendChild(createMetaItem('Venue', project.venue));
    }
    // 添加时间
    if (project.time) {
        const timeItem = createMetaItem('Time', project.time);
        timeItem.classList.add('time-item');  // 添加特定类名
        metaSection.appendChild(timeItem);
    }

    // 添加标签
    // 标签字段已在首页展示，此处不再重复

    // 添加工具
    if (project.tools) {
        const toolsItem = createMetaItem('Tools', project.tools);
        metaSection.appendChild(toolsItem);
    }


    // 添加助教
    // if (project.ta) {
    //     const taItem = createMetaItem('TA', project.ta);
    //     metaSection.appendChild(taItem);
    // }

    // 添加我的贡献
    if (project.myContribution) {
        const contributionItem = createMetaItem('My Work', project.myContribution);
        metaSection.appendChild(contributionItem);
    }

    // 添加合作者
    if (project.collaborator) {
        const collaboratorItem = createMetaItem('Work with', project.collaborator);
        metaSection.appendChild(collaboratorItem);
    }

    // 添加导师
    if (project.tutor) {
        const tutorItem = createMetaItem('Tutor', project.tutor);
        metaSection.appendChild(tutorItem);
    }

    // 添加奖项
    if (project.prize) {
        const prizeItem = createMetaItem('Award', project.prize);
        metaSection.appendChild(prizeItem);
    }

    // 添加项目描述
    if (project.briefDescription) {
        document.querySelector('.project-context').textContent = project.briefDescription;
    }

    // 添加叙事性文本
    if (project.narrative) {
        const narrativeItem = createMetaItem('Narrative', project.narrative);
        metaSection.appendChild(narrativeItem);
    }

    // 添加视频部分（在项目描述之后）
    if (project.youtubeLink) {
        const existingVideoSection = document.querySelector('.video-wrapper');
        const videoSection = existingVideoSection || document.createElement('div');
        videoSection.className = 'video-wrapper';
        
        const iframe = document.createElement('iframe');
        iframe.src = project.youtubeLink;
        iframe.title = `${project.title} video`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        
        videoSection.appendChild(iframe);
        
        // 将视频插入到项目描述后面
        if (!existingVideoSection) {
            const projectContext = document.querySelector('.project-context');
            projectContext.parentNode.insertBefore(videoSection, projectContext.nextSibling);
        }
    }
    if (project.pdfLink && project.pdfPageCount > 0) {
        appendPdfPages(project);
    }
}

function appendPdfPages(project) {
    const section = document.createElement('section');
    section.className = 'pdf-pages-section';
    section.setAttribute('aria-label', 'Paper pages');
    const grid = document.createElement('div');
    grid.className = 'pdf-pages-grid';

    for (let page = 1; page <= project.pdfPageCount; page++) {
        const link = document.createElement('a');
        link.className = 'pdf-page-link';
        link.href = `${project.pdfLink.split('#')[0]}#page=${page}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Open ${project.title}, PDF page ${page}`);
        const image = document.createElement('img');
        image.src = `/projects/${project.name}/pdf-pages/page-${String(page).padStart(2, '0')}.webp`;
        image.alt = `${project.title}, page ${page}`;
        image.loading = 'lazy';
        image.decoding = 'async';
        link.appendChild(image);
        const caption = document.createElement('span');
        caption.className = 'pdf-page-number';
        caption.textContent = `Page ${page}`;
        link.appendChild(caption);
        grid.appendChild(link);
    }

    section.appendChild(grid);
    const markdown = document.getElementById('markdown-content');
    markdown.after(section);
}

// Keep citation actions beside the paper links and BibTeX above the metadata rows.
function appendBibtexControls(project, linksWrapper, linksContainer) {
    const bibtex = project.getBibtex();
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'meta-link citation-copy';
    copyButton.textContent = 'Copy BibTeX';
    const status = document.createElement('span');
    status.className = 'citation-status';
    status.setAttribute('role', 'status');
    const pre = document.createElement('pre');
    pre.className = 'bibtex-box';
    pre.setAttribute('aria-label', 'BibTeX citation');
    pre.tabIndex = 0;
    const code = document.createElement('code');
    code.textContent = bibtex;
    pre.appendChild(code);
    let resetTimer;
    copyButton.addEventListener('click', async () => {
        copyButton.disabled = true;
        clearTimeout(resetTimer);
        status.textContent = '';
        try {
            await navigator.clipboard.writeText(bibtex);
            copyButton.textContent = 'Copied!';
            resetTimer = setTimeout(() => {
                copyButton.textContent = 'Copy BibTeX';
            }, 30_000);
        } catch {
            copyButton.textContent = 'Copy BibTeX';
            status.textContent = 'Select the BibTeX below to copy manually.';
        } finally {
            copyButton.disabled = false;
        }
    });
    linksWrapper.appendChild(copyButton);
    linksContainer.appendChild(status);
    linksContainer.appendChild(pre);
}

// 辅助函数：创建元数据项
function createMetaItem(label, content) {
    const item = document.createElement('div');
    item.className = 'metadata-item';
    
    const labelSpan = document.createElement('div');
    labelSpan.className = 'meta-label';
    labelSpan.textContent = label;
    
    const contentSpan = document.createElement('div');
    contentSpan.className = 'meta-text';
    contentSpan.textContent = content;
    
    item.appendChild(labelSpan);
    item.appendChild(contentSpan);
    
    return item;
}

// 辅助函数：创建链接
function createMetaLink(label, url) {
    const link = document.createElement('a');
    link.href = url;
    link.className = 'meta-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    return link;
}

export class ProjectPage {
    static init() {
        // 检查并记录项目访问
        VisitTracker.checkAndRecordCurrentProject();

        // 获取当前项目信息
        const projectName = this.getCurrentProjectName();
        const currentProject = projects.find(p => p.name === projectName);
        
        if (!currentProject) {
            console.error('Project not found');
            return;
        }
    }

    static getCurrentProjectName() {
        return window.location.pathname.split('/').slice(-2)[0];
    }
    
    constructor() {
        this.name = ProjectPage.getCurrentProjectName();
        this.project = projects.find(p => p.name === this.name);
        
        if (!this.project) {
            console.error('Project not found');
            return;
        }
    }
}

// 初始化页面
ProjectPage.init(); 
