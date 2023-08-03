import React from 'react'
import renderer from 'react-test-renderer';
import "@testing-library/jest-dom";
import Missing from './components/Missing';
import { MemoryRouter } from 'react-router'

test("should render Page Not Found", () => {
  const component = renderer.create(
		<MemoryRouter>
			<Missing />
		</MemoryRouter>
	)
  const testInstance = component.root;
  expect(testInstance.findByType("p").children).toEqual(['Page Not Found']);
  
});