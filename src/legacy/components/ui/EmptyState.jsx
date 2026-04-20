import { Empty, Button } from 'antd'

export default function EmptyState({ description, ctaText, onCta }) {
  return (
    <Empty
      description={description}
      style={{ marginTop: '50px' }}
      extra={
        ctaText && onCta ? (
          <Button type="primary" onClick={onCta}>
            {ctaText}
          </Button>
        ) : null
      }
    />
  )
}
