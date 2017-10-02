import React from 'react';

import { shallow } from 'enzyme';

import { expect } from 'chai';
import Invoices from '../../src/common/components/Invoices';


describe.skip('Invoices component', () => {
  it('should render', () => {
    const wrapper = shallow(<Invoices invoices={[]} />);

    expect(wrapper.find('h1').text()).to.contain('No feature toggle selected');
  });
});
