import React from 'react'
import {{PACKAGE_EXPORT}} from '{{PACKAGE_NAME}}'

describe('{{PACKAGE_EXPORT}}', () => {
  it('builds a component', () => {
    expect(typeof {{PACKAGE_EXPORT}}(React)).toBe('function')
  })
  describe('Component', () => {
    const Component = {{PACKAGE_EXPORT}}(React)
    it('has unit tests')
  })
})
