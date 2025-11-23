```cypher
CREATE VECTOR INDEX chunk_vector IF NOT EXISTS
FOR (c:Chunk)
ON (c.embedding)
OPTIONS {indexConfig: {
  `vector.dimensions`: 1536,
  `vector.similarity_function`: 'cosine'
}}
```
