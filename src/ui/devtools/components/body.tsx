import {html} from 'malevic';
import withState from 'malevic/state';
import {Button} from '../../controls';
import ThemeEngines from '../../../generators/theme-engines';
import {ExtWrapper} from '../../../definitions';

const devToolsDocsUrl = 'https://github.com/alexanderby/darkreader#how-to-contribute';

const initialTexts = new WeakSet<Element>();

interface BodyProps extends ExtWrapper {
    state?;
    setState?;
}

function Body({data, actions, state, setState}: BodyProps) {
    let textNode: HTMLTextAreaElement;

    const wrapper = (data.filterConfig.engine === ThemeEngines.staticTheme
        ? {
            header: 'Static Theme Editor',
            fixesText: data.devStaticThemesText,
            apply: (text) => actions.applyDevStaticThemes(text),
            reset: () => actions.resetDevStaticThemes(),
        } : data.filterConfig.engine === ThemeEngines.cssFilter || data.filterConfig.engine === ThemeEngines.svgFilter ? {
            header: 'Inversion Fix Editor',
            fixesText: data.devInversionFixesText,
            apply: (text) => actions.applyDevInversionFixes(text),
            reset: () => actions.resetDevInversionFixes(),
        } : {
                header: 'Dynamic Theme Editor',
                fixesText: [
                    'No config is required for Dynamic Theme',
                    'If some website has problems with Dynamic Theme',
                    'send it\'s address to darkreaderapp@gmail.com',
                ].join('\n'),
                apply: (text) => {},
                reset: () => {},
            });

    function onTextRender(node) {
        textNode = node;
        if (!state.errorText) {
            textNode.value = wrapper.fixesText;
        }
    }

    async function apply() {
        const text = textNode.value;
        try {
            await wrapper.apply(text);
            setState({errorText: null});
        } catch (err) {
            setState({
                errorText: String(err),
            });
        }
    }

    function reset() {
        wrapper.reset();
        setState({errorText: null});
    }

    return (
        <body>
            <header>
                <img id="logo" src="../assets/images/darkreader-type.svg" alt="Dark Reader" />
                <h1 id="title">Developer Tools</h1>
            </header>
            <h3 id="sub-title">{wrapper.header}</h3>
            <textarea
                id="editor"
                native
                didmount={onTextRender}
                didupdate={onTextRender}
            />
            <label id="error-text">{state.errorText}</label>
            <div id="buttons">
                <Button onclick={reset}>Reset</Button>
                <Button onclick={apply}>Apply</Button>
            </div>
            <p id="description">
                Read about this tool <strong><a href={devToolsDocsUrl} target="_blank">here</a></strong>.
                If a <strong>popular</strong> website looks incorrect
                e-mail to <strong>DarkReaderApp@gmail.com</strong>
            </p>
        </body>
    );
}

export default withState(Body, {errorText: null});
