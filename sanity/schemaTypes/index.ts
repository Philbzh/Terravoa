import { type SchemaTypeDefinition } from 'sanity'
import { producerType } from './producer'
import { productType } from './product'
import { regionType } from './region'
import { storyType } from './story'

export const schemaTypes: SchemaTypeDefinition[] = [
  producerType,
  productType,
  regionType,
  storyType,
]
