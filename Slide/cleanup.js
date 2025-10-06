/* utilities/cleanup.js
   Gắn vào các slide (iframe) bằng <script src="utilities/cleanup.js"></script>
   Cung cấp 2 hàm toàn cục:
     - cleanInsertedBlocks(root, options)
     - markTemp(node)
*/
(function(window){
  function cleanInsertedBlocks(root, options){
    root = root || document;
    options = options || {};
    const removeSelectors = options.removeSelectors || ['.temp','[data-temp]','.inserted-temp'];
    const removeEmpty = options.removeEmpty !== false; // default true

    // remove explicitly marked selectors
    try {
      removeSelectors.forEach(sel => {
        const list = root.querySelectorAll(sel);
        for (let i=0;i<list.length;i++) list[i].remove();
      });
    } catch(e){ /* ignore */ }

    if (!removeEmpty) return;

    // remove leaf elements that have no text and no element children
    try {
      const all = Array.from(root.querySelectorAll('*'));
      for (let i = all.length - 1; i >= 0; --i){
        const el = all[i];
        const tag = el.tagName && el.tagName.toLowerCase();
        if (!tag) continue;
        // skip structural / media / semantic elements that should stay
        if (['html','body','img','svg','canvas','video','iframe','picture','source'].includes(tag)) continue;
        if (el.hasAttribute('data-keep')) continue; // opt-out marker
        // don't remove elements with role/aria-label (likely meaningful)
        if (el.hasAttribute('role') || el.hasAttribute('aria-label') || el.hasAttribute('aria-hidden') === false) continue;
        const hasChildElements = el.querySelector('*') !== null;
        const text = el.textContent ? el.textContent.trim() : '';
        if (!hasChildElements && text === ''){
          el.remove();
        }
      }
    } catch(e){ /* ignore */ }
  }

  function markTemp(node){
    try{
      if (!node) return;
      if (node.classList) node.classList.add('inserted-temp');
      else node.setAttribute('data-temp','1');
    } catch(e){}
  }

  // expose to global
  window.cleanInsertedBlocks = cleanInsertedBlocks;
  window.markTemp = markTemp;

  // UMD-ish export for module environments (optional)
  try{
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { cleanInsertedBlocks, markTemp };
    }
  } catch(e){}
})(this);
