import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IMetadataExtension } from '@oyster/common';
import { Button, Col, Form, Input, InputNumber, Row, Space, Radio } from 'antd';
import React from 'react';
import { useArtworkFiles } from '.';
import { ArtCard } from '../../components/ArtCard';
import { useState } from 'react';

interface IMetadataExtensionPlus extends IMetadataExtension {
  maxSupplyType?: number;
}

export const InfoStep = (props: {
  attributes: IMetadataExtensionPlus;
  files: File[];
  setAttributes: (attr: IMetadataExtensionPlus) => void;
  confirm: () => void;
}) => {
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const [form] = Form.useForm();
  const [maxSupplyType, setMaxSupplyType] = useState(
    props.attributes.maxSupplyType || 0,
  );

  const getNestedMaxSupply = (maxSupplyType: number) => {
    const maxSupply = form.getFieldsValue().properties?.maxSupply;

    return {
      maxSupply:
        maxSupplyType === 0
          ? 0
          : maxSupplyType === 1
          ? maxSupply === 0 || !maxSupply
            ? 1
            : maxSupply
          : undefined,
    };
  };

  return (
    <Space className="metaplex-fullwidth" direction="vertical">
      <>
        <h2>Describe your item</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </>

      <Form
        name="dynamic_attributes"
        form={form}
        autoComplete="off"
        onValuesChange={field => {
          props.setAttributes({ ...props.attributes, ...field });
        }}
        initialValues={props.attributes}
        onFinish={formState => {
          const nftAttributes = formState.attributes;
          // value is number if possible
          for (const nftAttribute of nftAttributes || []) {
            const newValue = Number(nftAttribute.value);
            if (!isNaN(newValue)) {
              nftAttribute.value = newValue;
            }
          }
          console.log('Adding NFT attributes:', nftAttributes);
          props.setAttributes({
            ...props.attributes,
            ...formState,
            properties: {
              ...props.attributes.properties,
              ...formState.properties,
              ...getNestedMaxSupply(maxSupplyType),
            },
            attributes: nftAttributes,
          });

          props.confirm();
        }}
      >
        <Row justify="space-between" align="middle" wrap={false}>
          <Col span={6}>
            {props.attributes.image && (
              <ArtCard
                image={image}
                animationURL={animation_url}
                category={props.attributes.properties?.category}
                name={props.attributes.name}
                small={true}
              />
            )}
          </Col>
          <Col span={16}>
            <Space className="metaplex-fullwidth" direction="vertical">
              <label>
                <h3>Name</h3>

                <Form.Item
                  name="name"
                  rules={[
                    {
                      validator: async (_, info) => {
                        if (!(Buffer.from(info).length > 32)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'Needs to be fewer than 32 bytes',
                        );
                      },
                    },
                  ]}
                >
                  <Input
                    autoFocus
                    placeholder="Max 32 characters (fewer if using non-latin characters)"
                    allowClear
                  />
                </Form.Item>
              </label>

              <label>
                <h3>Description</h3>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      max: 500,
                    },
                  ]}
                >
                  <Input.TextArea
                    size="large"
                    placeholder="Max 500 characters"
                    allowClear
                  />
                </Form.Item>
              </label>

              <label>
                <h3>Mint Type</h3>
                <Form.Item name={['maxSupplyType']}>
                  <Radio.Group
                    onChange={e => {
                      setMaxSupplyType(e.target.value);
                      const newValues = {
                        ...props.attributes,
                        maxSupplyType: e.target.value,
                        properties: {
                          ...props.attributes.properties,
                          ...getNestedMaxSupply(e.target.value),
                        },
                      };
                      props.setAttributes(newValues);
                      form.setFieldsValue(newValues);
                    }}
                    value={maxSupplyType}
                    defaultValue={0}
                  >
                    <Radio value={0}>One of One</Radio>
                    <Radio value={1}>Limited Edition</Radio>
                    <Radio value={2}>Unlimited</Radio>
                  </Radio.Group>
                </Form.Item>
              </label>

              {maxSupplyType === 1 && (
                <label>
                  <h3>Maximum Supply</h3>
                  <Form.Item name={['properties', 'maxSupply']}>
                    <InputNumber
                      className="metaplex-fullwidth"
                      placeholder="Number of Editions"
                      defaultValue={1}
                      min={1}
                    />
                  </Form.Item>
                </label>
              )}

              <label>
                <h3>Attributes</h3>
              </label>

              <Form.List name="attributes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey }) => (
                      <Space key={key} align="baseline">
                        <Form.Item
                          name={[name, 'trait_type']}
                          fieldKey={[fieldKey, 'trait_type']}
                          hasFeedback
                        >
                          <Input placeholder="trait_type (Optional)" />
                        </Form.Item>
                        <Form.Item
                          name={[name, 'value']}
                          fieldKey={[fieldKey, 'value']}
                          rules={[{ required: true, message: 'Missing value' }]}
                          hasFeedback
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <Form.Item
                          name={[name, 'display_type']}
                          fieldKey={[fieldKey, 'display_type']}
                          hasFeedback
                        >
                          <Input placeholder="display_type (Optional)" />
                        </Form.Item>
                        <Button type="text" onClick={() => remove(name)}>
                          <MinusCircleOutlined />
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add attribute
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Space>
          </Col>
        </Row>

        <Form.Item>
          <Button
            className="metaplex-fullwidth"
            type="primary"
            size="large"
            htmlType="submit"
          >
            Continue to royalties
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};
