import * as core from '@actions/core'
import {HttpClient} from '@actions/http-client'
import {BearerCredentialHandler} from '@actions/http-client/lib/auth'

const defaultInterval = 10
const defaultTimeout = 600

type Deploy = {
  id: string
  status: string
  finishedAt: string
}

const run = async () => {
  const apiKey = core.getInput('api-key')
  const serviceId = core.getInput('service-id')
  const interval = Number(core.getInput('interval') || defaultInterval)
  const timeout = Number(core.getInput('timeout') || defaultTimeout)

  const client = new HttpClient('ttskch/render-deploy', [
    new BearerCredentialHandler(apiKey),
  ])

  const {result: createResult} = await client.postJson<Deploy>(
    `https://api.render.com/v1/services/${serviceId}/deploys`,
    undefined,
    {
      Authorization: `Bearer ${apiKey}`,
    },
  )

  if (!createResult) {
    throw new Error('Failed to trigger deploy.')
  }

  core.info(`Created deploy: ${JSON.stringify(createResult)}`)

  const deployId = createResult.id

  let count = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, interval * 1000)) // wait for interval

    const {result: checkResult} = await client.getJson<Deploy>(
      `https://api.render.com/v1/services/${serviceId}/deploys/${deployId}`,
    )

    core.info(`Checked deploy: ${JSON.stringify(checkResult)}`)

    if (checkResult && checkResult.finishedAt) {
      if (checkResult.status === 'live') {
        return
      }
      throw new Error(`Finished deploy status was "${checkResult.status}"`)
    }

    if ((count += interval) > timeout) {
      throw new Error('Timeout.')
    }
  }
}

run().catch((error) =>
  core.setFailed(error instanceof Error ? error.message : String(error)),
)
