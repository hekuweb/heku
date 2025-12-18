import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { resolveLink } from '../lib/contentfulPages'

/**
 * Component to render Contentful Rich Text fields
 * @param {Object} props
 * @param {Object} props.richTextDocument - The rich text document from Contentful
 * @param {Object} props.includes - The includes object for resolving embedded entries and assets
 */
function RichText({ richTextDocument, includes }) {
  if (!richTextDocument) {
    return null
  }

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text) => (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="mb-4 text-gray-700 font-body leading-relaxed">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="text-4xl font-heading text-gray-900 mb-4 mt-6">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 className="text-[60px] font-heading text-gray-900 mb-3 mt-6">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 className="text-2xl font-heading text-gray-900 mb-3 mt-5">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4 className="text-xl font-heading text-gray-900 mb-2 mt-4">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <h5 className="text-lg font-heading text-gray-900 mb-2 mt-4">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <h6 className="text-base font-heading text-gray-900 mb-2 mt-3">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 font-body">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 font-body">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => <li className="ml-4">{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 font-body">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-gray-300" />,
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entryId = node.data.target.sys.id
        const entry = resolveLink({ sys: { id: entryId, linkType: 'Entry' } }, includes)
        
        if (!entry) return null
        
        // Handle different embedded entry types
        const contentTypeId = entry.sys?.contentType?.sys?.id
        const fields = entry.fields || {}
        
        // You can add specific rendering for different content types here
        return (
          <div className="my-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Embedded: {contentTypeId}</p>
          </div>
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id
        const asset = resolveLink({ sys: { id: assetId, linkType: 'Asset' } }, includes)
        
        if (!asset || !asset.fields) return null
        
        const file = asset.fields.file
        const title = asset.fields.title || ''
        const description = asset.fields.description || ''
        
        if (file?.contentType?.startsWith('image/')) {
          const imageUrl = file.url ? `https:${file.url}` : null
          if (imageUrl) {
            return (
              <figure className="my-6">
                <img
                  src={imageUrl}
                  alt={description || title}
                  className="w-full h-auto rounded-lg"
                />
                {title && (
                  <figcaption className="mt-2 text-sm text-gray-500 text-center font-body">
                    {title}
                  </figcaption>
                )}
              </figure>
            )
          }
        }
        
        return null
      },
      [INLINES.HYPERLINK]: (node, children) => {
        const uri = node.data.uri
        return (
          <a
            href={uri}
            className="text-brand-primary hover:text-brand-primary/80 underline font-body"
            target={uri.startsWith('http') ? '_blank' : undefined}
            rel={uri.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      },
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        // Handle entry hyperlinks if needed
        return <span className="text-brand-primary">{children}</span>
      },
      [INLINES.ASSET_HYPERLINK]: (node, children) => {
        // Handle asset hyperlinks if needed
        return <span className="text-brand-primary">{children}</span>
      },
    },
  }

  return (
    <div className="rich-text-content">
      {documentToReactComponents(richTextDocument, options)}
    </div>
  )
}

export default RichText
