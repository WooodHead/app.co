import React from 'react'
import Link from 'next/link'
import download from 'downloadjs'
import { connect } from 'react-redux'

import { Table, Th, Thead, Td, SpacedTd } from '@components/mining-admin/table'
import { Section, Content } from '@components/mining-admin/month'

const appRows = (apps) => apps.map((app) => (
  <tr>
    <Td>
      <Link href={`/admin/app?id=${app.id}`}>
        <a>{app.name}</a>
      </Link>
    </Td>
    <SpacedTd>
      {app.category}
    </SpacedTd>
    <SpacedTd>
      {app.Rankings && app.Rankings[0] && app.Rankings[0].twitterMentions || 0}
    </SpacedTd>
    <SpacedTd>
      {app.status}
    </SpacedTd>
  </tr>
))

class AppList extends React.Component {
  async downloadAllApps() {
    const { jwt, apiServer } = this.props
    const url = `${apiServer}/api/admin/download-apps`
    const res = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`
      })
    })
    const blob = await res.blob()
    download(blob, 'App-co Apps.csv', 'text/csv')
  }

  render() {
    const { apps, title } = this.props
    return (
      <Section>
        <h1>{title}</h1>
        <Content>
          <a href="javascript:void(0)" onClick={() => this.downloadAllApps()}>Download all apps</a>
        </Content>
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Tweets/Week</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {appRows(apps)}
          </tbody>
        </Table>
      </Section>
    )
  }
}

const mapStateToProps = (state) => ({
  apiServer: state.apps.apiServer,
  jwt: state.user.jwt
})

export default connect(mapStateToProps)(AppList)
