import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { expect } from 'chai';
import Invoices from '../../src/common/components/Invoices';

configure({ adapter: new Adapter() });

describe.skip('Invoices component', () => {
  it('should render', () => {
    const wrapper = shallow(<Invoices invoices={[]} />);

    expect(wrapper.find('h1').text()).to.contain('No feature toggle selected');
  });
});
