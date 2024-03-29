import { Quirks, ScoreVector, Context, PersonalizedVariant, TestVariant, EnrichmentData } from '@uniformdev/context';
import * as react from 'react';
import react__default, { ReactNode, ReactElement, HTMLAttributes } from 'react';

/**
 * Provides reactive access to the Uniform Context's current visitor quirks values
 * This can be used when you want to read current quirk values directly.
 */
declare function useQuirks(): Quirks;

/**
 * Provides reactive access to the Uniform Context's current visitor scores values.
 * This can be used when you want to read current score values directly.
 */
declare function useScores(): ScoreVector;

type VariantOutputType = 'edge' | 'standard';
interface UniformContextProps$1 {
    /** The configured Uniform Context instance to provide */
    context: Context;
    /** The output type to emit.
     * - `standard` - Emits selected variants as HTML suitable for SSR or SSG
     * - `edge` - Emits all variants suitable for Edge-side personalization selection
     *
     * @default standard
     */
    outputType?: VariantOutputType;
    /**
     * Whether to track a route change to the current URL when this component is rendered.
     *
     * @default true
     */
    trackRouteOnRender?: boolean;
    /**
     * Whether to include Uniform transfer state tag in the page HTML.
     * - `always` - Always include Uniform transfer state tag in the page HTML
     * - `never` - Never include Uniform transfer state tag in the page HTML
     * - `server-only` - Only include Uniform transfer state tag in the page HTML when `window` is undefined, i.e. on the server or during SSG.
     *
     * @default server-only
     * */
    includeTransferState?: 'always' | 'never' | 'server-only';
}
/**
 * Registers Uniform Context with a React app (as a React Context!).
 * Children of this component may use the Context via hooks, such as useScores and useUniformContext.
 */
declare const UniformContext: react__default.FC<react__default.PropsWithChildren<UniformContextProps$1>>;

type UniformContextProps = {
    context: Context;
    outputType: VariantOutputType;
};

interface UseUniformContextOptions {
    throwOnMissingProvider?: boolean;
}
interface UseUniformContextThrowsOptions extends UseUniformContextOptions {
    throwOnMissingProvider: true;
}
interface UseUniformContextDoesNotThrowOptions extends UseUniformContextOptions {
    throwOnMissingProvider: false;
}
/**
 * Gets the current Uniform Context object (must be within a UniformContext component ancestor)
 *
 * IMPORTANT: The Context object's scores and quirks (i.e. context.scores) are NOT reactive when fetched with this hook.
 * If you need reactive scores or quirks use `useScores` and `useQuirks` instead.
 */
declare function useUniformContext(options?: UseUniformContextThrowsOptions): UniformContextProps;
declare function useUniformContext(options?: UseUniformContextDoesNotThrowOptions): UniformContextProps | undefined;

type PersonalizeWrapperComponent = react__default.ComponentType<{
    children: ReactNode;
    personalizationOccurred: boolean;
}>;
type PersonalizedVariationComponent<TVariation> = react__default.ComponentType<TVariation & {
    personalizationResult: {
        variation: PersonalizedVariant;
        personalizationOccurred: boolean;
    };
}>;
type PersonalizeComponentProps<TVariation extends PersonalizedVariant> = {
    /**
     * Name of the personalized placement. Should be unique to this placement location and set of variants.
     * This name is emitted to analytics after personalization executes.
     */
    name: string;
    /** The possible variations of the content to render depending on personalization conditions */
    variations: TVariation[];
    /** A React component to use to render a selected variant. */
    component: PersonalizedVariationComponent<TVariation>;
    /** A React component that will be used to wrap all personalized variants. If no variants match, the wrapper is not rendered. */
    wrapperComponent?: PersonalizeWrapperComponent;
    /** The number of variations to select. Use for personalized lists where the `count` most relevant should be shown. */
    count?: number;
};
declare function Personalize<TVariation extends PersonalizedVariant>(props: PersonalizeComponentProps<TVariation>): ReactElement | null;

type TVariation = TestVariant;
interface TestComponentProps<TVariation extends TestVariant> {
    /** Name of the test that is running. */
    name: string;
    /** Variation list that this test will selected from. */
    variations: TVariation[];
    /**
     * Determines what should be rendered if testing is in a "loading" state.
     * default: shows the default variation while loading
     * none: shows nothing while loading
     * React component: shows the component while loading
     */
    loadingMode?: 'default' | 'none' | react__default.ComponentType;
    /** A React component to use to render the test variant. */
    component: react__default.ComponentType<TVariation>;
}
declare const Test: <TVariation_1 extends TestVariant>(props: TestComponentProps<TVariation_1>) => ReactElement | null;

type TrackFragmentProps = {
    /** Behavior that will be pushed when tracking occurs. */
    behavior: EnrichmentData | EnrichmentData[] | undefined;
    /** Nested elements that are related to the behavior specified. */
    children: ReactNode;
};
/**
 * Tracks visitor behavior by adding enrichment score when they are shown a route with this component on it.
 *
 * NOTE: if you wish to track on the visitor seeing the content in the browser viewport instead,
 * use Track instead of TrackFragment.
 */
declare const TrackFragment: ({ behavior, children }: TrackFragmentProps) => react__default.JSX.Element;

type TrackProps = TrackFragmentProps & HTMLAttributes<HTMLElement> & {
    /**
     * Element tag that will be used for tracking.
     *
     * @defaultValue div
     */
    tagName?: keyof JSX.IntrinsicElements;
    /**
     * Disables visiblity checking on this component, will trigger behavior immediately on page load.
     *
     * @defaultValue If supported, `false`. `true` when window is undefined or when IntersectionObserver is not supported by browser.
     */
    disableVisibilityTrigger?: boolean;
    /**
     * Trigger behavior when this element is at least `threshold` visible.
     *
     * @defaultValue 0.5
     */
    threshold?: number | number[];
};
/**
 * Tracks visitor behavior by adding enrichment score when they view content wrapped in this component.
 * When the Track component is sufficiently in the viewport, it will trigger the enrichment values specified
 * in `behavior` to the current visitor. If the browser does not support IntersectionObserver, the behavior will
 * be triggered immediately on page load instead.
 *
 * NOTE: this component necessarily renders a wrapping tag to attach the IntersectionObserver to; this can result
 * in DOM changes when personalization is added. If that's undesirable use TrackFragment instead which tracks
 * only on page load, but does not render a wrapping tag.
 */
declare const Track: ({ behavior, children, tagName, threshold, disableVisibilityTrigger, ...rest }: TrackProps) => react.DOMElement<{
    ref: react.RefObject<HTMLElement>;
    defaultChecked?: boolean | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    suppressContentEditableWarning?: boolean | undefined;
    suppressHydrationWarning?: boolean | undefined;
    accessKey?: string | undefined;
    autoFocus?: boolean | undefined;
    className?: string | undefined;
    contentEditable?: (boolean | "true" | "false") | "inherit" | "plaintext-only" | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: (boolean | "true" | "false") | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    nonce?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    spellCheck?: (boolean | "true" | "false") | undefined;
    style?: react.CSSProperties | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: "yes" | "no" | undefined;
    radioGroup?: string | undefined;
    role?: react.AriaRole | undefined;
    about?: string | undefined;
    content?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;
    inputMode?: "url" | "search" | "text" | "none" | "tel" | "email" | "numeric" | "decimal" | undefined;
    is?: string | undefined;
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: (boolean | "true" | "false") | undefined;
    "aria-autocomplete"?: "none" | "list" | "inline" | "both" | undefined;
    "aria-braillelabel"?: string | undefined;
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: (boolean | "true" | "false") | undefined;
    "aria-checked"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colindextext"?: string | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?: boolean | "time" | "true" | "false" | "page" | "step" | "location" | "date" | undefined;
    "aria-describedby"?: string | undefined;
    "aria-description"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: (boolean | "true" | "false") | undefined;
    "aria-dropeffect"?: "link" | "none" | "copy" | "execute" | "move" | "popup" | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: (boolean | "true" | "false") | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: (boolean | "true" | "false") | undefined;
    "aria-haspopup"?: boolean | "dialog" | "menu" | "true" | "false" | "grid" | "listbox" | "tree" | undefined;
    "aria-hidden"?: (boolean | "true" | "false") | undefined;
    "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: (boolean | "true" | "false") | undefined;
    "aria-multiline"?: (boolean | "true" | "false") | undefined;
    "aria-multiselectable"?: (boolean | "true" | "false") | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "true" | "false" | "mixed" | undefined;
    "aria-readonly"?: (boolean | "true" | "false") | undefined;
    "aria-relevant"?: "text" | "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals" | undefined;
    "aria-required"?: (boolean | "true" | "false") | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowindextext"?: string | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: (boolean | "true" | "false") | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
    dangerouslySetInnerHTML?: {
        __html: string | TrustedHTML;
    } | undefined;
    onCopy?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onCopyCapture?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onCut?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onCutCapture?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onPaste?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onPasteCapture?: react.ClipboardEventHandler<HTMLElement> | undefined;
    onCompositionEnd?: react.CompositionEventHandler<HTMLElement> | undefined;
    onCompositionEndCapture?: react.CompositionEventHandler<HTMLElement> | undefined;
    onCompositionStart?: react.CompositionEventHandler<HTMLElement> | undefined;
    onCompositionStartCapture?: react.CompositionEventHandler<HTMLElement> | undefined;
    onCompositionUpdate?: react.CompositionEventHandler<HTMLElement> | undefined;
    onCompositionUpdateCapture?: react.CompositionEventHandler<HTMLElement> | undefined;
    onFocus?: react.FocusEventHandler<HTMLElement> | undefined;
    onFocusCapture?: react.FocusEventHandler<HTMLElement> | undefined;
    onBlur?: react.FocusEventHandler<HTMLElement> | undefined;
    onBlurCapture?: react.FocusEventHandler<HTMLElement> | undefined;
    onChange?: react.FormEventHandler<HTMLElement> | undefined;
    onChangeCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onBeforeInput?: react.FormEventHandler<HTMLElement> | undefined;
    onBeforeInputCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onInput?: react.FormEventHandler<HTMLElement> | undefined;
    onInputCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onReset?: react.FormEventHandler<HTMLElement> | undefined;
    onResetCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onSubmit?: react.FormEventHandler<HTMLElement> | undefined;
    onSubmitCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onInvalid?: react.FormEventHandler<HTMLElement> | undefined;
    onInvalidCapture?: react.FormEventHandler<HTMLElement> | undefined;
    onLoad?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onError?: react.ReactEventHandler<HTMLElement> | undefined;
    onErrorCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onKeyDown?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onKeyDownCapture?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onKeyPress?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onKeyPressCapture?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onKeyUp?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onKeyUpCapture?: react.KeyboardEventHandler<HTMLElement> | undefined;
    onAbort?: react.ReactEventHandler<HTMLElement> | undefined;
    onAbortCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onCanPlay?: react.ReactEventHandler<HTMLElement> | undefined;
    onCanPlayCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onCanPlayThrough?: react.ReactEventHandler<HTMLElement> | undefined;
    onCanPlayThroughCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onDurationChange?: react.ReactEventHandler<HTMLElement> | undefined;
    onDurationChangeCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onEmptied?: react.ReactEventHandler<HTMLElement> | undefined;
    onEmptiedCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onEncrypted?: react.ReactEventHandler<HTMLElement> | undefined;
    onEncryptedCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onEnded?: react.ReactEventHandler<HTMLElement> | undefined;
    onEndedCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadedData?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadedDataCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadedMetadata?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadedMetadataCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadStart?: react.ReactEventHandler<HTMLElement> | undefined;
    onLoadStartCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onPause?: react.ReactEventHandler<HTMLElement> | undefined;
    onPauseCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onPlay?: react.ReactEventHandler<HTMLElement> | undefined;
    onPlayCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onPlaying?: react.ReactEventHandler<HTMLElement> | undefined;
    onPlayingCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onProgress?: react.ReactEventHandler<HTMLElement> | undefined;
    onProgressCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onRateChange?: react.ReactEventHandler<HTMLElement> | undefined;
    onRateChangeCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onResize?: react.ReactEventHandler<HTMLElement> | undefined;
    onResizeCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onSeeked?: react.ReactEventHandler<HTMLElement> | undefined;
    onSeekedCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onSeeking?: react.ReactEventHandler<HTMLElement> | undefined;
    onSeekingCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onStalled?: react.ReactEventHandler<HTMLElement> | undefined;
    onStalledCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onSuspend?: react.ReactEventHandler<HTMLElement> | undefined;
    onSuspendCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onTimeUpdate?: react.ReactEventHandler<HTMLElement> | undefined;
    onTimeUpdateCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onVolumeChange?: react.ReactEventHandler<HTMLElement> | undefined;
    onVolumeChangeCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onWaiting?: react.ReactEventHandler<HTMLElement> | undefined;
    onWaitingCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onAuxClick?: react.MouseEventHandler<HTMLElement> | undefined;
    onAuxClickCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onClick?: react.MouseEventHandler<HTMLElement> | undefined;
    onClickCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onContextMenu?: react.MouseEventHandler<HTMLElement> | undefined;
    onContextMenuCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onDoubleClick?: react.MouseEventHandler<HTMLElement> | undefined;
    onDoubleClickCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onDrag?: react.DragEventHandler<HTMLElement> | undefined;
    onDragCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragEnd?: react.DragEventHandler<HTMLElement> | undefined;
    onDragEndCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragEnter?: react.DragEventHandler<HTMLElement> | undefined;
    onDragEnterCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragExit?: react.DragEventHandler<HTMLElement> | undefined;
    onDragExitCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragLeave?: react.DragEventHandler<HTMLElement> | undefined;
    onDragLeaveCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragOver?: react.DragEventHandler<HTMLElement> | undefined;
    onDragOverCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDragStart?: react.DragEventHandler<HTMLElement> | undefined;
    onDragStartCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onDrop?: react.DragEventHandler<HTMLElement> | undefined;
    onDropCapture?: react.DragEventHandler<HTMLElement> | undefined;
    onMouseDown?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseDownCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseEnter?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseLeave?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseMove?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseMoveCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseOut?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseOutCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseOver?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseOverCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseUp?: react.MouseEventHandler<HTMLElement> | undefined;
    onMouseUpCapture?: react.MouseEventHandler<HTMLElement> | undefined;
    onSelect?: react.ReactEventHandler<HTMLElement> | undefined;
    onSelectCapture?: react.ReactEventHandler<HTMLElement> | undefined;
    onTouchCancel?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchCancelCapture?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchEnd?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchEndCapture?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchMove?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchMoveCapture?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchStart?: react.TouchEventHandler<HTMLElement> | undefined;
    onTouchStartCapture?: react.TouchEventHandler<HTMLElement> | undefined;
    onPointerDown?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerDownCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerMove?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerMoveCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerUp?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerUpCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerCancel?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerCancelCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerEnter?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerEnterCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerLeave?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerLeaveCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerOver?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerOverCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerOut?: react.PointerEventHandler<HTMLElement> | undefined;
    onPointerOutCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onGotPointerCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onGotPointerCaptureCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onLostPointerCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onLostPointerCaptureCapture?: react.PointerEventHandler<HTMLElement> | undefined;
    onScroll?: react.UIEventHandler<HTMLElement> | undefined;
    onScrollCapture?: react.UIEventHandler<HTMLElement> | undefined;
    onWheel?: react.WheelEventHandler<HTMLElement> | undefined;
    onWheelCapture?: react.WheelEventHandler<HTMLElement> | undefined;
    onAnimationStart?: react.AnimationEventHandler<HTMLElement> | undefined;
    onAnimationStartCapture?: react.AnimationEventHandler<HTMLElement> | undefined;
    onAnimationEnd?: react.AnimationEventHandler<HTMLElement> | undefined;
    onAnimationEndCapture?: react.AnimationEventHandler<HTMLElement> | undefined;
    onAnimationIteration?: react.AnimationEventHandler<HTMLElement> | undefined;
    onAnimationIterationCapture?: react.AnimationEventHandler<HTMLElement> | undefined;
    onTransitionEnd?: react.TransitionEventHandler<HTMLElement> | undefined;
    onTransitionEndCapture?: react.TransitionEventHandler<HTMLElement> | undefined;
    'data-track-on-view-wrapper'?: string | undefined;
}, HTMLElement>;

export { Personalize, type PersonalizeComponentProps, type PersonalizeWrapperComponent, type PersonalizedVariationComponent, type TVariation, Test, type TestComponentProps, Track, TrackFragment, type TrackFragmentProps, type TrackProps, UniformContext, type UniformContextProps$1 as UniformContextProps, type VariantOutputType, useQuirks, useScores, useUniformContext };
