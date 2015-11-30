module Actions
  module Fusor
    module Organization
      class Setup < Actions::EntryAction
        def humanized_name
          _("Setup Organization")
        end

        def plan(organization)
          product = organization.products.where(:label => 'Fusor').first_or_create!(:name => "Fusor")
          repository = product.repositories.where(:label => 'Puppet')
            .first_or_create!(:name => "Puppet",
                              :content_type => Katello::Repository::PUPPET_TYPE)

          view = organization.content_views.where(:label => 'Fusor_Puppet_Content')
            .find_or_create!(:name => "Fusor Puppet Content")

          # puppet module doesn't need to exist for us to create content view puppet module
          view.puppet_modules.where(:name => "ovirt", :author => "jcannon").first_or_create!

          sequence do
            unless repository.puppet_modules.any? { |pm| pm.name == "ovirt" && pm.author == "jcannon" }
              plan_action(::Actions::Katello::Repository::UploadFiles,
                          repository,
                          ["/usr/share/ovirt-puppet/pkg/jcannon-ovirt-0.0.4.tar.gz"]
                         )
            end
            plan_action(::Actions::Katello::ContentView::Publish, view)
          end
        end
      end
    end
  end
end
