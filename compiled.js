/** @jsx h */
function h(type, props, ...children) {
    return { type, props: props || {}, children };
}

function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    setProps($el, node.props);
    node.children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
}

function changed(node1, node2) {
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        // 新增节点
        $parent.appendChild(createElement(newNode));
    } else if (!newNode) {
        // 删除节点
        $parent.removeChild($parent.childNodes[index]);
    } else if (changed(newNode, oldNode)) {
        //修改节点
        $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    } else if (newNode.type) {
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
        }
    }
}

function setProp($target, name, value) {
    if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
        setBooleanProp($target, name, value);
    } else {
        $target.setAttribute(name, value);
    }
}

function setBooleanProp($target, name, value) {
    if (value) {
        $target.setAttribute(name, value);
        $target[name] = true;
    } else {
        $target[name] = false;
    }
}

function setProps($target, props) {
    Object.keys(props).forEach(name => {
        setProp($target, name, props[name]);
    });
}

// class为关键字 所以用className代替
const a = h(
    'ul',
    { className: 'list', style: 'list-style: none' },
    h(
        'li',
        null,
        'item 1'
    ),
    h(
        'li',
        null,
        h(
            'button',
            { disabled: true },
            'disabled'
        ),
        h(
            'button',
            { disabled: false },
            'enabled'
        ),
        h('input', { type: 'checkbox', checked: true }),
        h('input', { type: 'checkbox', checked: false })
    )
);

const b = h(
    'ul',
    { className: 'list' },
    h(
        'li',
        null,
        'item 1'
    ),
    h(
        'li',
        null,
        'hello'
    )
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateElement($root, a);
$reload.addEventListener('click', () => {
    updateElement($root, b, a);
});
